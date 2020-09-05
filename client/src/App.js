import React from 'react';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 1080
  },
  progess: {
    margin: theme.spacing.unit * 2
  }
})

/*
constructor()
componentWillMount()
render()
componentDidMount()
shouldComponentUpdate()
*/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: "",
      completed: 0
    }
  }

  stateRefresh = () => {
    this.setState({
      customers: "",
      completed: 0
    });
    this.callApi()
      .then(res => this.setState({
        customers: res
      }))
      .catch(err => console.log(err));    
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);

    this.callApi()
      .then(res => this.setState({
        customers: res
      }))
      .catch(err => console.log(err));
  }

  callApi = async() => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ 
      completed: completed >= 100 ? 0 : completed + 1
    });
  }

  render() {
    const { classes } = this.props;

    if (this.state.customers) {
      clearInterval(this.timer);
    }

    return (
      <div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Birthday</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Job</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.customers ?
                  this.state.customers.map(c=> {
                    return (<Customer id={c.id} key={c.id} image={c.image} name={c.name} birthday={c.birthday} gender={c.gender} job={c.job} />);
                  }) 
                : 
                  <TableRow>
                    <TableCell colSpan="6" align="center">
                      <CircularProgress className={classes.progess} variant="determinate" value={this.state.completed} />
                    </TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>
        <CustomerAdd stateRefresh={this.stateRefresh} />
      </div>
    );
  }
}

export default withStyles(styles)(App);