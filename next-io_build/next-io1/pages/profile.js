import useAuth from "../hooks/useAuth"

export default function Profile() {

    const { user, error } = useAuth({ redirectTo: '/login' })

    return (
        <>
            <h1>Your Profile</h1>
            {
                !user && (error?.message || 'Loading...')
            }
            {
                user &&
                <pre>
                    { JSON.stringify(user, null, 2) }
                </pre>
            }
        </>
    )
}

// export async function getServerSideProps()
// {
//     // Auth
//     return {
//         redirect: {
//             destination: '/login',
//         }
//     }
// }