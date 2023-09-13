import { Content as AntdContent } from 'antd/es/layout/layout'
import TokenInfo from './TokenInfo/TokenInfo'
import { StyledRow } from './Content.styles'

const Content = () => {
  return (
    <AntdContent>
      <StyledRow>
        <div>
          <TokenInfo />
        </div>
        <div>
          <div>Token actions</div>
        </div>
      </StyledRow>
    </AntdContent>
  )
}

export default Content
