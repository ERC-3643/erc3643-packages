import { Content as AntdContent } from 'antd/es/layout/layout'
import TokenInfo from './TokenInfo/TokenInfo'
import { StyledCol, StyledRow } from './Content.styles'
import IdentityRegistryInfo from './IdentityRegistryInfo/IdentityRegistryInfo'
import ComplianceInfo from './ComplianceInfo/ComplianceInfo'

const Content = () => {
  return (
    <AntdContent>
      <StyledRow>
        <StyledCol>
          <TokenInfo />
          <IdentityRegistryInfo />
          <ComplianceInfo />
        </StyledCol>
        <StyledCol>
          <div>Token actions</div>
        </StyledCol>
      </StyledRow>
    </AntdContent>
  )
}

export default Content
