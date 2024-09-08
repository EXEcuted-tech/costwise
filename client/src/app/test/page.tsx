"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/server/config';
import { User } from '@/types/data';

const Page: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get<User[]>(`${config.API}/api/users`)
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the users:', error);
      });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {users.map((user, index) => (
        <div key={index}>
          {user.first_name} {user.middle_name} {user.last_name} {user.email_address}
        </div>
      ))}
    </div>
  );
};

export default Page;