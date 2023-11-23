import React, { Component } from 'react';
import { getRestaurants } from '../services/RestaurantService';

export class FetchRestaurants extends Component {
    static displayName = FetchRestaurants.name;

    constructor(props) {
        super(props);
        this.state = { restaurants: [], loading: true };
    }

    componentDidMount() {
        this.populateRestaurantData();
    }

    async populateRestaurantData() {
        const data = await getRestaurants();
        this.setState({ restaurants: data, loading: false });
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchRestaurants.renderRestaurantsTable(this.state.restaurants);

        return (
            <div>
                <h1 id="tableLabel">Restaurants</h1>
                <p>This component demonstrates fetching restaurant data from the server.</p>
                {contents}
            </div>
        );
    }

    static renderRestaurantsTable(restaurants) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.map(restaurant =>
                        <tr key={restaurant.id}>
                            <td>{restaurant.id}</td>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.address}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}