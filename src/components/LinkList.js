import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LINKS_PER_PAGE } from '../constants';
import Link from './Link';

export const FEED_QUERY = gql`
  query FEED_QUERY (
    $take: Int
    $skip: Int
    $orderBy: LinkOrderByInput
  ) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`
;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
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
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      links {
        id
        url
        description
        createdAt
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
      user {
        id
      }
    }
  }
`;

const getQueryVariables = (isNewPage, page) => {
  const skip = isNewPage ? (page -1) * LINKS_PER_PAGE : 0;
  const take = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = {createdAt: 'desc'};
  return {skip, take, orderBy};
}

const getLinksToRender = (isNewPage, data) => {
  if (isNewPage) {
    return data.feed.links;
  }
  const rankesLinks = data.feed.links.slice();
  rankesLinks.sort(
    (l1, l2) => l2.votes.length - l1.votes.length
  );
  return rankesLinks;
}

const LinkList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNewPage = location.pathname.includes(
    'new'
  );
  const pageIndexParams = location.pathname.split(
    '/'
  );
  const page = parseInt(
    pageIndexParams[pageIndexParams.length - 1]
  );
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
  }); 

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(
        ({ id }) => id === newLink.id
      );
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      })
    }
  });
  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : -----{error.graphQLErrors}</p>;

  return (
    <>
      {getLinksToRender(isNewPage, data).map(
        (link, index) => (
          <Link
            key={link.id}
            link={link}
            index={index + pageIndex}
          />
        )
      )}
      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div
            className="pointer mt2"
            onClick={() => {
              if(page > 1) {
                navigate(`/new/${page - 1}`);
              }
            }}
          >
            Previous
          </div>
          <div
            className="pointer mt2"
            onClick={() => {
              console.log(data.feed.count)
              if( page <= data.feed.count / LINKS_PER_PAGE) {
                console.log("ssssss")
                const nextPage = page + 1;
                navigate(`/new/${nextPage}`)
              }
            }}
          >
            Next
          </div>
        </div>
      )}
    </>
  );
};

export default LinkList;