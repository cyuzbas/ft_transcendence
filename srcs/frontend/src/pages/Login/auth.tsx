import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Lobby/components/SettingsModal/Button";
import axios from "axios";
import { UserContext } from "../../contexts";

interface Validate2faInput {
  token: string;
}

const styles = {
  inputField: `form-control block w-full px-4 py-4 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`,
};

const Validate2faPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState<string>("");

  async function check(token: string) {
    try {
      console.log("auth 2 factor control!!!!!!!!\n");
      const response = await axios.get<{ data: boolean }>(
        `http://localhost:3001/auth/verify/${token}/${user.intraId}`
      );
      if (response.data) {
        setUser(user => ({
            ...user,
            twoFactorCorrect : true
        }));
      } else {
        setError("Wrong code!!!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
<></>
  );
};

export default Validate2faPage;
