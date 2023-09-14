import { Content as AntdContent } from 'antd/es/layout/layout'
import TokenInfo from './TokenInfo/TokenInfo'
import { StyledCol, StyledRow } from './Content.styles'
import IdentityRegistryInfo from './IdentityRegistryInfo/IdentityRegistryInfo'
import ComplianceInfo from './ComplianceInfo/ComplianceInfo'
import EligibilityVerificationInfo from './EligibilityVerificationInfo/EligibilityVerificationInfo'
import TokenActions from './TokenActions/TokenActions'

const Content = () => {
  return (
    <AntdContent>
      <StyledRow>
        <StyledCol>
          <TokenInfo />
          <IdentityRegistryInfo />
          <ComplianceInfo />
          <EligibilityVerificationInfo />
        </StyledCol>
        <StyledCol>
          <TokenActions />
        </StyledCol>
      </StyledRow>
    </AntdContent>
  )
}

export default Content
