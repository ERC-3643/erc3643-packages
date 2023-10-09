import TokenInfo from './TokenInfo/TokenInfo'
import IdentityRegistryInfo from './IdentityRegistryInfo/IdentityRegistryInfo'
import ComplianceInfo from './ComplianceInfo/ComplianceInfo'
import EligibilityVerificationInfo from './EligibilityVerificationInfo/EligibilityVerificationInfo'
import TokenActions from './TokenActions/TokenActions'
import { Box, Grid, Paper } from '@mui/material'
import React from 'react'

const Content = () => {
  return (
    <Box sx={{ mt: '110px' }}>
      <Grid container spacing={2}>
        <Grid xs={6} item>
          <Paper elevation={3} sx={{ mt: 1, mb: 2, ml: 1, p: 2 }}>
            <TokenInfo />
          </Paper>
          <Paper elevation={3} sx={{ mt: 1, mb: 2, ml: 1, p: 2 }}>
            <IdentityRegistryInfo />
          </Paper>
          <Paper elevation={3} sx={{ mt: 1, mb: 2, ml: 1, p: 2 }}>
            <ComplianceInfo />
          </Paper>
          <Paper elevation={3} sx={{ mt: 1, mb: 2, ml: 1, p: 2 }}>
            <EligibilityVerificationInfo />
          </Paper>
        </Grid>
        <Grid xs={6} item>
          <Paper elevation={3} sx={{ mt: 1, mb: 2, ml: 1, p: 2 }}>
            <TokenActions />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Content
