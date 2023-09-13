import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'
import { Button } from 'antd'

export const StyledHeader = styled(Header)`
  background-color: #1976d2;
  color: white;
`

export const StyledRow = styled.div`
  display: flex;

  > div {
    width: 50%;
  }
`

export const StyledLeftCol = styled.div`
  display: flex;
  align-items: center;
`
export const StyledRightCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

export const StyledPill = styled.div`
  margin-right: 25px;
  color: #ff9800;
  border: 1px solid #ff9800;
  border-radius: 16px;
  line-height: 1;
  padding: 10px;
`
