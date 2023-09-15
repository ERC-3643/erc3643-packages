import styled from '@emotion/styled'
import { Theme } from '@mui/material'

export const StyledHeader = styled.div<{ theme: Theme }>`
  min-height: 50px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: white;
`

export const StyleLogoText = styled.p`
  font-size: 21px;
`

export const StyledPill = styled.div`
  margin-right: 25px;
  color: #ff9800;
  border: 1px solid #ff9800;
  border-radius: 16px;
  line-height: 1;
  padding: 10px;
`
