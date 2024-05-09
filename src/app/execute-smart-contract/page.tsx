"use client";
import React, { useState, useEffect, useRef } from "react";
import Banner from "@/app/components/Banner";
import {
  Label,
  TextInput,
  Textarea,
  Button,
  Tabs,
  TabsRef,
  Card,
} from "flowbite-react";
import { checkIfAddressIsValid } from "@/app/utils/blockchain";
import toast from "react-hot-toast";
import { HiAdjustments, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { useWeb3Modal } from "@web3modal/ethers/react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";

interface AbiFunction {
  name: string;
  stateMutability: string;
  inputs: { name: string; type: string }[];
}

interface StoredContract {
  address: string;
  abi: string;
  chainId: string;
}

interface AbiInput {
  name: string;
  type: string;
}

interface FunctionAbi {
  name: string;
  type: string;
  stateMutability: string;
  inputs: AbiInput[];
}

interface ContractFunctionProps {
  func: FunctionAbi;
  index: number;
  provider?: any;
  contractAddress: string;
}

const ExecutePage: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const { address, chainId } = useWeb3ModalAccount();

  const [contractAddress, setContractAddress] = useState("");

  const [abi, setAbi] = useState("");
  const [readFunctions, setReadFunctions] = useState<any[]>([]);
  const [writeFunctions, setWriteFunctions] = useState<any[]>([]);
  const [storedContracts, setStoredContracts] = useState<Array<StoredContract>>(
    []
  );
  const [contract, setContract] = useState<Contract | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<AbiFunction | null>(
    null
  );
  const [showResult, setShowResult] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { open } = useWeb3Modal();
  const [completeSetup, setCompleteSetup] = useState(false);

  useEffect(() => {
    setStoredContracts(getStoredContracts());
  }, []);

  async function getSigner() {
    if (walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider);
      setProvider(ethersProvider);
      const signer = await ethersProvider.getSigner();
      setSigner(signer);
      return signer;
    }
  }

  const handleContractAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!checkIfAddressIsValid(e.target.value)) {
      toast.dismiss();
      toast.error("Invalid Address");
      return;
    }
    setContractAddress(e.target.value);
  };

  const handleAbiChange = () => {
    try {
      const parsedAbi = JSON.parse(abi?.toString() || "[]");
      setReadFunctions(
        parsedAbi.filter(
          (item: any) =>
            item.type === "function" &&
            (item.stateMutability === "view" ||
              item.stateMutability === "pure" ||
              item.stateMutability === "constant")
        )
      );
      setWriteFunctions(
        parsedAbi.filter(
          (item: any) =>
            item.type === "function" &&
            (item.stateMutability === "nonpayable" ||
              item.stateMutability === "payable")
        )
      );
    } catch (error) {
      console.error("Invalid ABI");
    }
  };

  const getStoredContracts = (): Array<StoredContract> => {
    try {
      let storedContracts = JSON.parse(
        localStorage.getItem("stored_contracts")!
      );
      if (!storedContracts) return [];
      else return storedContracts;
    } catch (err) {
      return [];
    }
  };

  const storeContract = (address: string, abi: string, chainId: string) => {
    let storedContracts: Array<StoredContract> | null = getStoredContracts();
    if (!storedContracts) {
      storedContracts = [];
    }
    if (storedContracts.length >= 6) {
      storedContracts.pop();
    }
    storedContracts = [{ address: address, abi: abi, chainId: chainId }].concat(
      storedContracts
    );
    localStorage.setItem("stored_contracts", JSON.stringify(storedContracts));
    setStoredContracts(storedContracts);
  };

  const createContractInstance = async () => {
    const newSigner = await getSigner();
    if (newSigner === undefined) {
      toast.dismiss();
      toast.error("Connect Wallet");
      return;
    } else {
      // console.log("ABI ->", abi);
      // console.log("Contract Address ->", contractAddress);
      // console.log("Signer ->", newSigner);
      if (abi && contractAddress) {
        handleAbiChange();
        storeContract(
          contractAddress,
          JSON.stringify(abi),
          chainId!.toString()
        );
        const contractInstance = new Contract(contractAddress, abi, newSigner);
        setContract(contractInstance);
        if (readFunctions.length > 0) {
          setSelectedFunction(readFunctions[0]);
        }
        renderRead();
        tabsRef.current?.setActiveTab(1);
        setCompleteSetup(true);
      } else {
        toast.dismiss();
        toast.error("Invalid ABI / Contract Address");
        setCompleteSetup(false);
      }
    }
  };

  const renderRead = () => {
    setShowResult(false);
    if (readFunctions.length > 0) {
      setSelectedFunction(readFunctions[0]);
    }
  };

  const loadContract = (contract: StoredContract) => {
    setAbi(JSON.parse(contract.abi));
    setContractAddress(contract.address);
  };

  const ContractReadFunctions: React.FC<ContractFunctionProps> = ({
    func,
    index,
    provider,
    contractAddress,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputs, setInputs] = useState<string[]>([]);
    const [result, setResult] = useState<string | null | number>(null);
    const [error, setError] = useState<string | null | unknown>(null);
    const contractInstance = new Contract(contractAddress, [func], provider);

    const toggleOpen = () => {
      setIsOpen(!isOpen);
      setResult(null);
    };

    const handleInputChange = (value: string, idx: number) => {
      const newInputs = [...inputs];
      newInputs[idx] = value;
      setInputs(newInputs);
    };

    const callContractFunction = async () => {
      try {
        if (inputs.length !== func.inputs.length) {
          toast.dismiss();
          toast.error("Invalid Input");
          return;
        }
        console.log("inputs ->", inputs);
        toast.dismiss();
        toast.loading("Fetching...");
        const response = await contractInstance[func.name](...inputs);
        setResult(JSON.stringify(response.toString()));
        toast.dismiss();
        toast.success("Done!");
      } catch (error) {
        toast.dismiss();
        setError(error);
        toast.error("Error calling contract function");
      }
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-medium">
            {index + 1}. {func.name}
          </h2>
          <button
            onClick={toggleOpen}
            className={`text-sm ${isOpen ? "text-brand" : "text-gray-600"}`}
          >
            {isOpen ? "Hide" : "Expand"}
          </button>
        </div>
        {isOpen && (
          <div className="mt-1 space-y-2">
            {func.inputs.map((input, inputIndex) => (
              <TextInput
                key={inputIndex}
                type="text"
                sizing="md"
                className="mt-2"
                placeholder={`${input.type} (${input.name})`}
                onChange={(e) => handleInputChange(e.target.value, inputIndex)}
              />
            ))}
            {!result && (
              <Button
                size="xs"
                pill
                className="brand mb-1"
                onClick={callContractFunction}
              >
                Query
              </Button>
            )}
            {result && (
              <>
                Result of {func.name} (method)
                <TextInput
                  type="text"
                  sizing="md"
                  className="mt-2"
                  value={result}
                  readOnly
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const ContractWriteFunctions: React.FC<ContractFunctionProps> = ({
    func,
    index,
    contractAddress,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputs, setInputs] = useState<string[]>([]);
    const [result, setResult] = useState<string | null | number>(null);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const contractInstance = new Contract(contractAddress, [func], signer);

    const toggleOpen = () => {
      setIsOpen(!isOpen);
      setResult(null);
    };

    const handleInputChange = (value: string, idx: number) => {
      const newInputs = [...inputs];
      newInputs[idx] = value;
      setInputs(newInputs);
    };

    const callContractFunction = async () => {
      try {
        if (inputs.length !== func.inputs.length) {
          toast.dismiss();
          toast.error("Invalid Input");
          return;
        }
        setLoading(true);
        toast.dismiss();
        toast.loading("Executing Transaction...");
        const tx = await contractInstance[func.name](...inputs);
        console.log(tx);
        console.log("Transaction hash:", tx.hash);
        setTxHash(tx.hash);
        const receipt = await tx.wait();
        if (receipt.status === 0) {
          setResult(`Transaction failed with hash: ${receipt.transactionHash}`);
          return;
        }
        setResult(
          `Transaction successful with hash: ${receipt.transactionHash}`
        );
        toast.dismiss();
        toast.success("Transaction successful!");
      } catch (error) {
        toast.dismiss();
        console.error("Error calling contract function:", error);
        setResult(`Error: ${error}`);
        toast.error("Error calling contract function");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-md font-medium">
            {index + 1}. {func.name}
          </h2>
          <button
            onClick={toggleOpen}
            className={`text-sm ${isOpen ? "text-brand" : "text-gray-600"}`}
          >
            {isOpen ? "Hide" : "Expand"}
          </button>
        </div>
        {isOpen && (
          <div className="mt-1 space-y-2">
            {func.inputs.map((input, inputIndex, index) => (
              <TextInput
                key={inputIndex}
                type="text"
                sizing="md"
                className="mt-2"
                placeholder={`${input.type} (${input.name})`}
                onChange={(e) => handleInputChange(e.target.value, inputIndex)}
              />
            ))}
            {!result && !loading && (
              <Button
                size="xs"
                pill
                className="brand mb-1"
                onClick={callContractFunction}
              >
                Execute
              </Button>
            )}
            {loading && (
              <>
                <Button size="xs" pill className="brand mb-1" disabled>
                  Pending...
                </Button>
              </>
            )}
            {txHash && (
              <>
                <Label
                  htmlFor="contractAddress"
                  value="Transaction Hash"
                  className="text-dark text-sm mt-4"
                />
                <TextInput
                  type="text"
                  sizing="sm"
                  className="mt-2"
                  value={txHash}
                  readOnly
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const trimWalletAddress = (address: string) => {
    return `${address.substring(0, 7)}...${address.substring(37, 42)}`;
  };

  const clearHistory = () => {
    localStorage.removeItem("stored_contracts");
    setStoredContracts([]);
  };

  return (
    <>
      <Banner title="Interact With any Smart Contract" />
      <div className="max-w-screen-md mx-auto">
        <div className="max-w mt-5">
          <div className="flex flex-col gap-3">
            <Tabs
              aria-label="Full width tabs"
              style="fullWidth"
              ref={tabsRef}
              onActiveTabChange={(tab) => setActiveTab(tab)}
            >
              <Tabs.Item active title="Setup" icon={HiUserCircle}>
                {address && (
                  <div className="ml-2 mr-2 mb-2">
                    <Label
                      value="Manage Wallet"
                      className="text-dark text-md"
                    />
                    <div className="flex justify-left">
                      <w3m-button />
                    </div>
                  </div>
                )}
                <div className="ml-2 mr-2 mb-2 block">
                  <Label
                    htmlFor="contractAddress"
                    value="Smart Contract Address"
                    className="text-dark text-md"
                  />
                  <TextInput
                    id="contractAddress"
                    type="text"
                    sizing="md"
                    className="mt-2"
                    placeholder="Enter your Smart Contract Address"
                    required
                    maxLength={42}
                    value={contractAddress}
                    onChange={handleContractAddressChange}
                  />
                </div>
                <div className="ml-2 mr-2 mb-2 block">
                  <Label
                    htmlFor="abi"
                    value="Your Smart Contract ABI"
                    className="text-dark text-md"
                  />
                  <Textarea
                    id="abi"
                    placeholder="Paste your ABI"
                    className="mt-2"
                    required
                    rows={4}
                    value={abi}
                    onChange={(e) => setAbi(e.target.value)}
                    onBlur={handleAbiChange}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
                  {address && (
                    <Button
                      size="sm"
                      pill
                      className="brand"
                      onClick={createContractInstance}
                    >
                      Let's Go
                    </Button>
                  )}
                  {!address && (
                    <Button
                      size="sm"
                      pill
                      className="brand"
                      onClick={() => open()}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </div>
                <div className="ml-2 mr-2 mb-2 mt-10 block">
                  {storedContracts.length > 0 && address && (
                    <>
                      <h3 className="text-xl text-center mt-4 mb-4 font-bold">
                        Load from History
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {storedContracts.map((contract, index) => (
                          <div className="max-w-xs w-full" key={index}>
                            <Card
                              onClick={() => loadContract(contract)}
                              style={{ cursor: "pointer" }}
                            >
                              <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                                ChainId: {contract.chainId}
                              </h5>
                              <p className="font-normal text-gray-700 dark:text-gray-400">
                                {trimWalletAddress(contract.address)}
                              </p>
                            </Card>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
                        <Button
                          size="xs"
                          pill
                          className="brand"
                          onClick={clearHistory}
                        >
                          Clear History
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="Read"
                color="gray"
                disabled={!completeSetup}
                icon={MdDashboard}
              >
                <div className="row mt-50 tran3s">
                  <div className="max-w-4xl mx-auto p-6 rounded-lg">
                    <h1 className="text-xl font-semibold mb-4">
                      Read from Contract
                    </h1>
                    {readFunctions.map((func, index) => (
                      <ContractReadFunctions
                        key={index}
                        func={func}
                        index={index}
                        provider={provider}
                        contractAddress={contractAddress}
                      />
                    ))}
                  </div>
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="Write"
                color="gray"
                disabled={!completeSetup}
                icon={HiAdjustments}
              >
                <div className="row mt-50 tran3s">
                  <div className="max-w-4xl mx-auto p-6 rounded-lg">
                    <h1 className="text-xl font-semibold mb-4">
                      Write to Contract
                    </h1>
                    {writeFunctions.map((func, index) => (
                      <ContractWriteFunctions
                        key={index}
                        func={func}
                        index={index}
                        contractAddress={contractAddress}
                      />
                    ))}
                  </div>
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutePage;
