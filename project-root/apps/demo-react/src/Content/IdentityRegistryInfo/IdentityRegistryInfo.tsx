import { TOKEN_ADDRESS } from '../../constants'
import { useSigner } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { useIdentityRegistry, useToken } from '@erc-3643/react-usedapp'

const IdentityRegistryInfo = () => {
  const [investorCountry, setInvestorCountry] = useState('')
  const signer = useSigner()
  const token = useToken(TOKEN_ADDRESS, signer)
  const [identityRegistryAddress, setIdentityRegistryAddress] = useState('')
  const identityRegistry = useIdentityRegistry(identityRegistryAddress, signer)

  useEffect(() => {
    if (!token) {
      return
    }

    ;(async () => {
      setIdentityRegistryAddress(await token?.identityRegistry())
    })()
  }, [token])

  useEffect(() => {
    if (!identityRegistry || !signer) {
      return
    }

    ;(async () => {
      setInvestorCountry(await identityRegistry.getInvestorCountry(await signer.getAddress()))
    })()
  }, [identityRegistry, signer])

  return (
    <div>
      <h3>Identity Registry Info</h3>
      <div>Investor Country: {investorCountry}</div>
    </div>
  )
}

export default IdentityRegistryInfo
