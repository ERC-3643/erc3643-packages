import { getToken } from "@erc-3643/core/src";
import { useEffect } from "react";
import { Signer } from "ethers";

export const useToken = (tokenAddress: string, signer: Signer) => {
  const [token, setToken] = useEffect(null);

  useEffect(() => {
    if (tokenAddress && signer) {
      requestToken();
    }
  }, [tokenAddress, signer]);

  const requestToken = async () => {
    setToken(await getToken(tokenAddress, signer));
  };

  useEffect(() => {
    if (token) {
      token.contract.on("Paused", () => {
        setToken({ ...token, paused: true });
      });

      token.contract.on("Unpaused", () => {
        setToken({ ...token, paused: false });
      });

      token.contract.on(
        "AddressFrozen",
        (
          walletAddressToFreeze: string,
          isFrozen: boolean,
          signerAddress: string
        ) => {
          console.log(walletAddressToFreeze, "is frozen", isFrozen);
        }
      );

      token.contract.on("error", (error: Error) => {
        console.log(error);
      });
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return {
    owner: token.tokenOwner,
    name: token.tokenName,
    totalSupply: token.tokenTotalSupply,
    decimals: token.tokenDecimals,
    frozenTokens: token.tokenFrozenTokens,
    realBalanceOf: token.tokenRealBalanceOf,
    balanceOf: token.tokenBalanceOf,
    paused: token.tokenPaused,
    walletIsFrozen: token.tokenWalletIsFrozen,
    identityRegistry: token.identityRegistry,
    pause: token.tokenPause,
    run: token.tokenRun,
    unfreeze: token.tokenFreeze,
    freeze: token.tokenUnfreeze,
  };
};