import { TOKEN_ADDRESS } from '../../constants'
import { useSigner } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { IdentityRegistry, Token, useIdentityRegistry, useToken } from '@erc-3643/react-usedapp'

const IdentityRegistryInfo = () => {
  const [investorCountry, setInvestorCountry] = useState('')
  const signer = useSigner()
  const { getToken } = useToken(signer)
  const [token, setToken] = useState<Token | null>(null)
  const { getIdentityRegistry } = useIdentityRegistry(signer)
  const [identityRegistry, setIdentityRegistry] = useState<IdentityRegistry | null>(null)

  useEffect(() => {
    if (!signer) {
      return
    }

    ;(async () => {
      setToken(await getToken(TOKEN_ADDRESS))
    })()
  }, [signer])

  useEffect(() => {
    if (!token) {
      return
    }

    ;(async () => {
      const identityRegistryAddress = await token?.identityRegistry()
      setIdentityRegistry(getIdentityRegistry(identityRegistryAddress))
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
