import type {
  Hash,
  Hex,
  PrivateKeyAccount,
  SignableMessage,
  TransactionSerializable,
  TypedDataDefinition,
} from "viem";
import type { ThirdwebClient } from "../client/client.js";
import type { AbiFunction, Address, TypedData } from "abitype";
import type { Transaction } from "../transaction/index.js";
import type { IWallet } from "./interfaces/wallet.js";

export function privateKeyWallet(client: ThirdwebClient) {
  return new PrivateKeyWallet(client);
}

type PrivateKeyWalletConnectOptions = {
  pkey: string;
};

class PrivateKeyWallet implements IWallet {
  private account: PrivateKeyAccount | null = null;

  get address() {
    return this.account?.address || null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_client: ThirdwebClient) {
    // this.client = client;
  }

  public async connect(options: PrivateKeyWalletConnectOptions) {
    const { pkey } = options;
    const { privateKeyToAccount } = await import("viem/accounts");
    this.account = privateKeyToAccount(pkey as Hex);
  }

  public async signMessage(message: SignableMessage) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return this.account.signMessage({ message });
  }

  public async signTransaction(tx: TransactionSerializable) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return this.account.signTransaction(tx);
  }

  public async signTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
  >(typedData: TypedDataDefinition<typedData, primaryType>) {
    if (!this.account) {
      throw new Error("not connected");
    }
    return this.account.signTypedData(typedData);
  }

  // tx functions

  public async sendTransaction<abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ) {
    if (!this.account || !this.address) {
      throw new Error("not connected");
    }
    const rpcRequest = tx.client.rpc({ chainId: tx.inputs.chainId });

    const [getDefaultGasOverrides, encode, transactionCount] =
      await Promise.all([
        import("../gas/fee-data.js").then((m) => m.getDefaultGasOverrides),
        import("../transaction/actions/encode.js").then((m) => m.encode),
        import("../rpc/methods.js").then((m) => m.transactionCount),
      ]);

    const [gasOverrides, encodedData, nextNonce, estimatedGas] =
      await Promise.all([
        getDefaultGasOverrides(tx.client, tx.inputs.chainId),
        encode(tx),
        transactionCount(rpcRequest, this.address),
        this.estimateGas(tx),
      ]);

    const signedTx = await this.signTransaction({
      gas: estimatedGas,
      to: tx.inputs.address as Address,
      chainId: tx.inputs.chainId,
      data: encodedData,
      nonce: nextNonce,
      ...gasOverrides,
    });

    // send the tx
    // TODO: move into rpc/methods
    const { result } = await rpcRequest({
      method: "eth_sendRawTransaction",
      params: [signedTx],
    });
    tx.transactionHash = result as Hash;

    return {
      transactionHash: result as Hash,
      wait: async () => {
        const { waitForTxReceipt } = await import(
          "../transaction/actions/wait-for-tx-receipt.js"
        );
        return waitForTxReceipt(tx);
      },
    };
  }

  public async estimateGas<abiFn extends AbiFunction>(
    tx: Transaction<abiFn>,
  ): Promise<bigint> {
    if (!this.account) {
      throw new Error("not connected");
    }
    const { estimateGas } = await import(
      "../transaction/actions/estimate-gas.js"
    );
    return estimateGas(tx, this);
  }

  public async disconnect() {
    this.account = null;
  }
}