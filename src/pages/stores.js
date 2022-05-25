import { useState, useEffect } from "react";
import Head from "next/head";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import center from "@turf/center";
import { points } from "@turf/helpers";
import Layout from "@components/Layout";
import Container from "@components/Container";
import Button from "@components/Button";
import Map from "@components/Map";

import styles from "@styles/Page.module.scss";

export default function Stores({ storeLocations }) {
  const [activeStore, setActiveStore] = useState();
  const features = points(
    storeLocations.map(({ location }) => {
      return [location.latitude, location.longitude];
    })
  );

  const [defaultLatitude, defaultLongitude] = center(
    features
  )?.geometry.coordinates;

  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear Store Locations</title>
        <meta name="description" content="Space Jelly Gear Store Locations" />
      </Head>

      <Container>
        <h1 className={styles.heading}>Locations</h1>

        <div className={styles.stores}>
          <div className={styles.storesLocations}>
            <ul className={styles.locations}>
              {storeLocations.map((location) => {
                function handleOnClick() {
                  setActiveStore(location.id);
                }
                return (
                  <li key={location.id}>
                    <p className={styles.locationName}>{location.name}</p>
                    <address>{location.address}</address>
                    <p>{location.phoneNumber}</p>
                    <p className={styles.locationDiscovery}>
                      <button onClick={handleOnClick}>View on Map</button>
                      <a
                        href={`https://www.google.com/maps/dir//${location.location.latitude},${location.location.longitude}/@${location.location.latitude},${location.location.longitude},12z/`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions
                        <FaExternalLinkAlt />
                      </a>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.storesMap}>
            <div className={styles.storesMapContainer}>
              <Map
                className={styles.map}
                center={[defaultLatitude, defaultLongitude]}
                zoom={4}
                scrollWheelZoom={false}
              >
                {({ TileLayer, Marker, Popup }, map) => {
                  const MapEffect = () => {
                    useEffect(() => {
                      if (!activeStore) return;
                      const { location } = storeLocations.find(
                        ({ id }) => id === activeStore
                      );
                      map.setView([location.latitude, location.longitude], 14);
                    }, [activeStore]);
                    return null;
                  };
                  return (
                    <>
                      <MapEffect />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {storeLocations.map((location) => {
                        const { latitude, longitude } = location.location;
                        return (
                          <Marker
                            key={location.id}
                            position={[latitude, longitude]}
                          >
                            <Popup>
                              <p>{location.name}</p>
                              <p>{location.address}</p>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </>
                  );
                }}
              </Map>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri:
      "https://api-us-west-2.graphcms.com/v2/cl2du1clj5b9801ywfsvngxxg/master",
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageStores {
        storeLocations {
          address
          id
          name
          phoneNumber
          location {
            latitude
            longitude
          }
        }
      }
    `,
  });

  const storeLocations = data.data.storeLocations;

  return {
    props: {
      storeLocations,
    },
  };
}
