import { contracts } from '@tokenysolutions/t-rex'
import { useCompliance, useComplianceModules } from '@erc-3643/react-usedapp'
import { BOB_WALLET, COMPLIANCE_ADDRESS } from '../../constants'
import { useSigner } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { Button, Input } from 'antd'
import {
  StyledComplianceModule,
  StyledFieldRow,
  StyledWalletExample,
} from './ComplianceInfo.styles'
import { Signer } from '@ethersproject/abstract-signer'
import { ComplianceModuleStatus } from './interfaces'

const ComplianceInfo = () => {
  const contractNamesMapper: { [key: string]: string } = {
    '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB': contracts.CountryAllowModule.contractName,
    '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9': contracts.CountryAllowModule.contractName,
  }
  const signer = useSigner()
  const compliance = useCompliance(COMPLIANCE_ADDRESS, signer)
  const [signerAddress, setSignerAddress] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [tokensAmount, setTokensAmount] = useState('0')
  const [modulesAddresses, setModulesAddressed] = useState<string[]>([])
  const complianceModules = useComplianceModules(
    modulesAddresses,
    contracts.CountryAllowModule.abi,
    signer as Signer,
  )
  const [complianceModulesStatuses, setComplianceModulesStatuses] = useState<
    ComplianceModuleStatus[]
  >([])
  const [canTransfer, setCanTransfer] = useState(false)

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setSignerAddress(await signer.getAddress())
    })()
  }, [signer])

  const onCanTransfer = async () => {
    if (!compliance) {
      return
    }

    setComplianceModulesStatuses([])

    const transferOk = await compliance.canTransfer(
      signerAddress,
      transferTo,
      parseFloat(tokensAmount),
    )

    setCanTransfer(transferOk)

    if (!transferOk) {
      setModulesAddressed(await compliance.getModules())
    }
  }

  useEffect(() => {
    if (!modulesAddresses.length) {
      return
    }

    Promise.all(
      complianceModules.map(async ({ contractAddress, moduleCheck }) => ({
        address: contractAddress,
        name: contractNamesMapper[contractAddress],
        status: await moduleCheck(
          signerAddress,
          transferTo,
          parseFloat(tokensAmount),
          COMPLIANCE_ADDRESS,
        ),
      })),
    ).then((values) => setComplianceModulesStatuses(values))
  }, [modulesAddresses, complianceModules])

  return (
    <div>
      <h3>Compliance Info:</h3>
      <div>Can transfer?: {canTransfer ? 'Yes' : 'No'}</div>
      <div>From: {signerAddress}</div>
      <StyledFieldRow>
        <Input
          placeholder='Transfer to wallet'
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
        />
        <StyledWalletExample>ex. Bob wallet: {BOB_WALLET}</StyledWalletExample>
      </StyledFieldRow>
      <StyledFieldRow>
        <div>Amount of tokens</div>
        <Input
          type='number'
          placeholder='Amount of tokens'
          value={tokensAmount}
          onChange={(e) => setTokensAmount(e.target.value)}
        />
      </StyledFieldRow>
      <div>
        <Button type='primary' onClick={onCanTransfer}>
          Can transfer?
        </Button>
      </div>

      {complianceModulesStatuses.length > 0 && (
        <div>
          <h3>Compliance Modules:</h3>
          {complianceModulesStatuses.map(({ address, name }, index) => (
            <StyledComplianceModule key={index}>
              <div>{address}</div>
              <div>
                {name} - <strong>Restrict</strong>
              </div>
            </StyledComplianceModule>
          ))}
        </div>
      )}
    </div>
  )
}

export default ComplianceInfo
