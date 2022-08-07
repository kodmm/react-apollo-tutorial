import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CREATE_LINK_MUTATION = gql`
  mutation LinkMutation(
    $description: String!
    $url: String!
  ) {
    createLink(description: $description, url: $url) {
        id
        description
        url
    }
  }
`;

const CreateLink = () => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        description: '',
        url: '',
    });

    const [createLink, {data, loading, error}] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
           description: formState.description,
           url: formState.url
        },
        onCompleted: () => navigate('/')
    });
    if (error) return <p>Error: {error.message} </p>

    return (
        <div>
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    createLink();
                }}
            >
                <div className="flex flex-column mt3">
                    <input 
                        className="mb2"
                        value={formState.description}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                description: e.target.value 
                            })
                        }
                        type="input"
                        placeholder="A description for the link"
                    />
                    <input
                        className="mb2"
                        value={formState.url}
                        onChange={(e) =>
                        setFormState({
                            ...formState,
                            url: e.target.value
                        })
                        }
                        type="text"
                        placeholder="The URL for the link"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateLink