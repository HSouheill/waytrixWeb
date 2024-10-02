import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NumOfVideosOfEahResto.css';
import { ipAddress } from '../../../config';

export const NumOfVideosOfEahResto = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const partnerToken = localStorage.getItem('partnerToken');
        const partnerId = localStorage.getItem('partnerId');
        const headers = {
          'Authorization': partnerToken,
        };
        const requestBody = {
          "partnerId": partnerId
        };
        const response = await axios.post(`${ipAddress}/api/PartnerAccountRoutes/get_all_restaurants_for_a_specific_partner`, requestBody, { headers });
        setRestaurants(response.data);

        // Iterate over each restaurant to make a POST request
        response.data.forEach(async (restaurant) => {
          try {
            const requestBodyVideos = {
              "partnerId": partnerId,
              "restoId": restaurant._id
            };
            const videoResponse = await axios.post(`${ipAddress}/api/PartnerAccountRoutes/num_of_videos_in_each_resto_per_day`, requestBodyVideos, { headers });
            const totalMaxTimes = videoResponse.data.totalMaxTimes;
            // Update the restaurant object with the response data
            setRestaurants(prevRestaurants => prevRestaurants.map(resto => 
              resto._id === restaurant._id ? { ...resto, totalMaxTimes } : resto
            ));

            // Fetch vouchers collected for each restaurant
            const vouchersResponse = await axios.post(`${ipAddress}/api/PartnerAccountRoutes/num_of_vouchers_collected_resto_specific`, { restoId: restaurant._id }, { headers });
            const winnedVouchers = vouchersResponse.data.WinnedVouchers;
            // Update the restaurant object with the vouchers data
            setRestaurants(prevRestaurants => prevRestaurants.map(resto =>
              resto._id === restaurant._id ? { ...resto, winnedVouchers } : resto
            ));
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="num-of-videos-container">
      {restaurants.map((restaurant) => (
        <div key={restaurant._id} className="restaurant-card complex-dark-theme">
          <div className="restaurant-name">{restaurant.name}</div>
          <div className="restaurant-email">{restaurant.email}</div>
          <div className="restaurant-phone">{restaurant.phone}</div>
          <div className="total-max-times" style={{fontWeight:'bold',textTransform:'uppercase'}}>Num Of Videos IN Each Resto Per Day: <br/> <span style={{fontSize:42,color:'#a6a6a6', fontWeight:'bold', fontStyle:'italic'}}>{restaurant.totalMaxTimes}</span></div>
          
          <div className="winned-vouchers">Redeemed Vouchers: <br/> <span style={{fontSize:42,color:'#a6a6a6', fontWeight:'bold', fontStyle:'italic'}}>{restaurant.winnedVouchers ? restaurant.winnedVouchers:0}</span></div>
        </div>
      ))}
    </div>
  );
};

export default NumOfVideosOfEahResto;
