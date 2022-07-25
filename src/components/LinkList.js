import { gql, useQuery } from '@apollo/client';
import React from 'react';
import Link from './Link';

const LINK_QUERY = gql`
  {
    links {
      title
      address
      id
    }
  }
`
;

const LinkList = () => {
    
  const { loading, error, data } = useQuery(LINK_QUERY); 
  console.log("------")
  console.log(data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <div>
      {data.links.map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </div>
  );
};

export default LinkList;