import { useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN } from '../constants';
const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation(
    $input: NewUser!
  ) {
    createUser(
      input: $input
    ) {
      token
    }
  }
`;


const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $input: Login!
  ) {
    login(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    login: true,
    username: '',
    password: '',
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      input: { username: formState.username, password: formState.password }
    },
    onError: (error) => {
      console.log(error.message)
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token);
      navigate('/');
    }
  });

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    variables: {
      input: { username: formState.username, password: formState.password }
    },
    onError: (error) => {
      console.log(error.message)
    },
    onCompleted: ({ createUser }) => {
      localStorage.setItem(AUTH_TOKEN, createUser.token);
      navigate('/');
    }
  });



  return (
    <div>
      <h4 className="mv3">
        {formState.login ? 'Login' : 'Sign Up'}
      </h4>
      <div className="flex flex-column">
        <input
          value={formState.username}
          onChange={(e) =>
            setFormState({
              ...formState,
              username: e.target.value
            })
          }
          type="text"
          placeholder="Your username address"
        />
        <input
          value={formState.password}
          onChange={(e) =>
            setFormState({
              ...formState,
              password: e.target.value
            })
          }
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <button
          className="pointer mr2 button"
          onClick={formState.login ? login : createUser }
        >
          {formState.login ? 'login' : 'create account'}
        </button>
        <button
          className="pointer button"
          onClick={(e) =>
            setFormState({
              ...formState,
              login: !formState.login
            })
          }
        >
          {formState.login
            ? 'need to create an account?'
            : 'already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default Login;