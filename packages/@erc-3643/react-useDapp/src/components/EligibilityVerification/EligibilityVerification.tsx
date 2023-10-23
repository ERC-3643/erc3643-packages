import { providers, Signer } from "ethers";
import { useEligibilityVerificationHolder } from "../../hooks";
import { useEffect, useState } from "react";

const EligibilityVerificationHolder = ({
  tokenAddress,
  walletAddress,
  signer,
}: {
  tokenAddress: string;
  walletAddress: string;
  signer: Signer | providers.Web3Provider;
}) => {
  const { verifyHolderEligibility } = useEligibilityVerificationHolder({
    signer,
  });
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [verificationErrors, setVerificationErrors] = useState<string[]>([]);

  useEffect(() => {
    checkVerification();
  }, [tokenAddress, walletAddress, signer]);

  const checkVerification = async () => {
    try {
      await verifyHolderEligibility({ tokenAddress, walletAddress });
      setIsVerified(true);
    } catch (e: any) {
      setIsVerified(false);
      setVerificationErrors(e.cause ?? []);
    }
  };

  return (
    <div>
      {isVerified === null ? (
        <div>Verifying eligibility...</div>
      ) : (
        <>
          {isVerified ? (
            <div>
              <span style={{ color: "green" }}>&#10003;</span>&nbsp;Holder
              identity is verified.
            </div>
          ) : (
            <div>
              <div>
                <span style={{ color: "red" }}>&#x2717;</span>&nbsp; Holder
                identity is not verified.
              </div>
              {verificationErrors.map((error) => (
                <div>{error}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EligibilityVerificationHolder;
