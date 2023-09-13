import styled from 'styled-components'

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 0 15px;

  > div {
    width: 48%;
  }
`

export const StyledCol = styled.div`
  > div {
    margin-bottom: 10px;
    padding: 10px;
    box-shadow: 1px 1px 3px 0 lightgray;
  }
`
