import { useTransferCompliance } from '@erc-3643/react-usedapp'
import { BOB_WALLET, TOKEN_ADDRESS } from '../../constants'
import { useSigner } from '@usedapp/core'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { StyledTextField, StyledWalletExample } from './ComplianceInfo.styles'
import { Signer } from 'ethers'
import { Box } from '@mui/material'
import { StyledChip } from '../../components/Chip/Chip.styles'

const ComplianceInfo = () => {
  const signer = useSigner()
  const { isTransferCompliant } = useTransferCompliance()
  const [signerAddress, setSignerAddress] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [tokensAmount, setTokensAmount] = useState('0')
  const [canTransfer, setCanTransfer] = useState(false)
  const [complianceErrors, setComplianceErrors] = useState<string[]>([])

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setSignerAddress(await signer.getAddress())
    })()
  }, [signer])

  const onCanTransfer = async () => {
    if (!signer) {
      return
    }

    const { result, errors } = await isTransferCompliant(
      signer as Signer,
      TOKEN_ADDRESS,
      signerAddress,
      transferTo,
      parseFloat(tokensAmount),
    )
    setCanTransfer(Boolean(result))
    setComplianceErrors(errors)
  }

  return (
    <>
      <h3>Compliance Info:</h3>
      <div>
        Can transfer?:{' '}
        {canTransfer ? (
          <StyledChip label='Yes' color='success' />
        ) : (
          <StyledChip label='No' color='error' />
        )}
      </div>
      <div>From: {signerAddress}</div>
      <Box sx={{ mb: 1 }}>
        <StyledTextField
          label='Transfer to wallet'
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
        />
        <StyledWalletExample>ex. Bob wallet: {BOB_WALLET}</StyledWalletExample>
      </Box>
      <Box sx={{ mb: 1 }}>
        <StyledTextField
          type='number'
          label='Amount of tokens'
          value={tokensAmount}
          onChange={(e) => setTokensAmount(e.target.value)}
        />
      </Box>
      <div>
        <Button variant='contained' onClick={onCanTransfer}>
          Can transfer?
        </Button>
      </div>

      {complianceErrors.length > 0 && (
        <div>
          <h3>Compliance Modules:</h3>
          {complianceErrors.map((error, index) => (
            <p>
              <StyledChip key={index} label={error} color='error' />
            </p>
          ))}
        </div>
      )}
    </>
  )
}

export default ComplianceInfo
