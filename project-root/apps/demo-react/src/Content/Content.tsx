import { Content as AntdContent } from 'antd/es/layout/layout'
import TokenInfo from './TokenInfo/TokenInfo'
import { StyledCol, StyledRow } from './Content.styles'
import IdentityRegistryInfo from './IdentityRegistryInfo/IdentityRegistryInfo'
import ComplianceInfo from './ComplianceInfo/ComplianceInfo'
import EligibilityVerificationInfo from './EligibilityVerificationInfo/EligibilityVerificationInfo'

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
          <div>Token actions</div>
        </StyledCol>
      </StyledRow>
    </AntdContent>
  )
}

export default Content
