
import React from "react";
import { useAuth } from "oidc-react";

const CallApi = () => {
    const auth = useAuth();
    const [posts, setPosts] = React.useState(null);

    React.useEffect(() => {
        (async () => {
            try {
                const token = auth.userData?.access_token;
                const response = await fetch("http://localhost:6091/account/profile/info", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data= await response.json();
                console.log(data);
                setPosts(data);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [auth]);

    if (!posts) {
        return <div>Call API...</div>;
    }

    return (
        <div className="posts-container">
              <h3 className="post-body">API Data</h3>
               <p className="post-body">sub:{posts.sub}</p>
               <p className="post-body">iat:{posts.iat}</p>
               <p className="post-body">exp:{posts.exp}</p>
               <p className="post-body">aud:{posts.aud}</p>
               <p className="post-body">iss:{posts.iss}</p>
               <p className="post-body">scope:{posts.scope}</p>
        </div>
    );
};

export default CallApi;