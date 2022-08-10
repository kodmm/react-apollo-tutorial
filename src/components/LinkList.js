import { gql, useQuery } from '@apollo/client';
import React from 'react';
import Link from './Link';

export const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`
;

const LinkList = () => {
  const { loading, error, data } = useQuery(FEED_QUERY); 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : -----{error.graphQLErrors}</p>;

  return (
    <div>
      {data.feed.links.map((link, index) => (
        <Link key={link.id} link={link} index={index}/>
      ))}
    </div>
  );
};

export default LinkList;