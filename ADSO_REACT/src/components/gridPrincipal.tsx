import  Box  from '@mui/material/Box'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const ComponenteGrid = ()=>{

    return (

          <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>

        <Item>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md:6}}>
              <Item> xs=6 md=4</Item>
            </Grid>
         
            <Grid size={{xs:2, md:6}}>
              <Item> xs=6 md=4</Item>
            </Grid>
          </Grid>
        </Item>
      </Grid>

  
      </Grid>
    </Box>

    )
}


export default ComponenteGrid;