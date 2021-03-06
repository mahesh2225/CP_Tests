import React, { Component } from "react";
import Header from '../../common/header/Header';
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { faRupeeSign, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Custom Styles used to customize material ui components
 * @param {*} theme
 */
const styles = theme => ({
    /** set the styles for  Grid*/
    root: {
        flexGrow: 1,
    },
    /** set the style for card text */
    cardText: {
        padding: '7%',
    },
    /** set the style for ctaegories dispalyed on a card */
    categories: {
        fontSize: 'large',
        marginTop: '16%',
        marginBottom: '10%'
    },
    /** set style for the image displayed on the card */
    image: {
        height: '200px',
        width: '100%'
    },
    /** set style for rating box dispalyed in the crad */
    ratingBox: {
        backgroundColor: '#eec64f',
        color: 'white',
        padding: '2%',
        fontSize: 'x-small',
        fontWeight: 'bold'
    },
    /** set style for rupees displayed in card*/
    rupees: {
        float: 'right',
        fontSize: 'small',
    }
})

/**
 * Style the home screen
 */
const homeStyles = {
    margin: '22px'
}

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            search: '',
            dispMessage: 'dispNone'
        }
    }

    /** this method will called before the components get mount */
    UNSAFE_componentWillMount() {
        let that = this;
        let xhrData = new XMLHttpRequest();
        let restaurants = null;
        xhrData.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurants: JSON.parse(this.response).restaurants
                });
                that.setState({ dispMessage: 'dispNone' })
            }
        });
        xhrData.open("GET", this.props.baseUrl + '/restaurant');
        xhrData.send(restaurants);
    }

    /**
     * this method is used to search the restaurant according 
     * to restaurant name typed where 'searchValue' is the restaurant
     * name that needs to be searched
     */
    searchBoxChangeHandler = (searchValue) => {
        this.setState({ search: searchValue })
        //this will search restaurant ,if searchValue is non-empty
        if (searchValue !== '' && searchValue !== null) {
            let that = this;
            let xhrData = new XMLHttpRequest();
            let restaurants = null;
            xhrData.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    that.setState({
                        restaurants: JSON.parse(this.response).restaurants
                    });
                    if (that.state.restaurants.length === 0) {
                        that.setState({ dispMessage: 'dispBlock' })
                    } else {
                        that.setState({ dispMessage: 'dispNone' })
                    }
                }
            });
            xhrData.open("GET", this.props.baseUrl + '/restaurant/name/' + searchValue);
            xhrData.send(restaurants);

        } else {
            this.UNSAFE_componentWillMount();
        }
    }

    /** 
     * This method will be used to redirect to details page 
     * depeding upon the restaurant which is clicked
     * 'restaurantId' is uuid of restaurant which is clicked
     */
    cardClickHandler = (restaurantId) => {
        this.props.history.push("/restaurant/" + restaurantId);
    }

    render() {
        const { classes } = this.props;
        let rdata = this.state.restaurants;
        return (
            <div>
                <Header pageId='home' baseUrl={this.props.baseUrl} searchBoxChangeHandler={this.searchBoxChangeHandler} />
                <div style={homeStyles}>
                    <GridList cellHeight={"auto"} spacing={16} >
                        {rdata !== [] && rdata !== null && rdata.map(restaurant => (
                            <Grid container item key={restaurant.id} className={classes.root} xs={6}
                                sm={6} lg={3} >
                                <Card onClick={() => this.cardClickHandler(restaurant.id)}>
                                    <CardActionArea>
                                        <CardContent>
                                            <div>
                                                <img src={restaurant.photo_URL} className={classes.image} alt={restaurant.id} />
                                            </div>
                                            <div className={classes.cardText} >
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {restaurant.restaurant_name}
                                                </Typography>
                                                <Typography variant="body2" component="p" className={classes.categories}>
                                                    {restaurant.categories}
                                                </Typography>
                                                <div>
                                                    <span className={classes.ratingBox}>
                                                        <FontAwesomeIcon icon={faStar} /> &nbsp;
                                                    <span> {restaurant.customer_rating}</span>
                                                        &nbsp;
                                                    ({restaurant.number_customers_rated})
                                                </span>
                                                    <span className={classes.rupees}>
                                                        <FontAwesomeIcon icon={faRupeeSign} />
                                                        {restaurant.average_price}
                                                        &nbsp; for two
                                                </span>
                                                </div>
                                            </div >
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </GridList>
                    <div className={this.state.dispMessage}>
                        <Typography>No restaurant with the given name.</Typography>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Home);