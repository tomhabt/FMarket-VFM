import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import StallItem from '../StallItem';
import { QUERY_USERS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_STALLS, UPDATE_CURRENT_STALL } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
// import { UPDATE_PRODUCTS } from '../../utils/actions';
// import { idbPromise } from "../../utils/helpers";

function StallList() {
  const [state, dispatch] = useStoreContext();

  const { loading, data } = useQuery(QUERY_USERS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_STALLS,
        stalls: data.getUsers.map((user) => {
          if (user.stall) {
            return user.stall
          } 
        })
        || []
      })
      data.getUsers.forEach((user) => {
        if (user.stall) {
          idbPromise('stalls', 'put', user.stall)
        }
      });

    } else if (!loading) {
      idbPromise('stalls', 'get').then((stalls) => {
        dispatch({
          type: UPDATE_STALLS,
          stalls: stalls
        })
      })
    }
  }, [data, loading, dispatch])

  useEffect(()=> {
    if (data) {
    dispatch({
      type: UPDATE_CURRENT_STALL,
      currentStall: ""
    });
  }
  },[data, dispatch]);

  return (
    <div className="my-2">
      <h2 style={{ textDecoration: 'underline' }} className="text-center">Recommended Stalls</h2>
      {state.stalls.length ? (
        <div className="flex-row">
          <Container>
            <Row>
              {state.stalls.map(stall => (
                stall ? (
                <Col xs={12}>
                  <StallItem
                    key={stall._id}
                    _id={stall._id}
                    name={stall.name}
                    description={stall.description}
                    image={stall.image}
                    products={stall.products}
                    upvotes={stall.upvotes}
                  />
                </Col>
                )
                : <></>
              ))}
            </Row>
          </Container>
        </div>
      ) : (
        <h3>There aren't any stalls yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default StallList;
