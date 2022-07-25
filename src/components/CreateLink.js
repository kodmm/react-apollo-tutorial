import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CREATE_LINK_MUTATION = gql`
  mutation LinkMutation(
    $input: NewLink!,
  ) {
    createLink(input: $input) {
        id
        title
        address
    }
  }
`;

const CreateLink = () => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        title: '',
        address: '',
    });

    const [createLink, {data, loading, error}] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            input: formState,
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
                        value={formState.title}
                        onChange={(e) => 
                            setFormState({
                                ...formState,
                                title: e.target.value 
                            })
                        }
                        type="input"
                        placeholder="A description for the link"
                    />
                    <input
                        className="mb2"
                        value={formState.address}
                        onChange={(e) =>
                        setFormState({
                            ...formState,
                            address: e.target.value
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