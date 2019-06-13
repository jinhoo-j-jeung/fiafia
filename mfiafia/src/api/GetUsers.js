import _ from 'lodash';


const users = [
    {
        name: {
            first: "John",
            last: "Doe"
        },
        email: "johndoe@gmail.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/men/97.jpg"
    },
    {
        name: {
            first: "Minseok",
            last: "Choi"
        },
        email: "minseokchoi@gmail.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/men/44.jpg"
    },
    {
        name: {
            first: "Jinhoo",
            last: "Jeung"
        },
        email: "jinhoojeung@gmail.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/men/54.jpg"
    },
    {
        name: {
            first: "Herring",
            last: "Grace"
        },
        email: "herringgrace@naver.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/women/24.jpg"
    },
    {
        name: {
            first: "Sam",
            last: "Sung"
        },
        email: "sam_sung@lg.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/men/72.jpg"
    },
    {
        name: {
            first: "El",
            last: "Gee"
        },
        email: "lg@samsung.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/women/12.jpg"
    },
    {
        name: {
            first: "Daniel",
            last: "Kim"
        },
        email: "danielkim@gmail.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/men/3.jpg"
    },
    {
        name: {
            first: "Sam",
            last: "Kim"
        },
        email: "samkim@gmail.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/men/5.jpg"
    },
    {
        name: {
            first: "Paul",
            last: "Kim"
        },
        email: "paulkim@gmail.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/men/57.jpg"
    },
    {
        name: {
            first: "Grace",
            last: "Kim"
        },
        email: "gracekim@gmail.com",
        avatar_url: "https://randomuser.me/api/portraits/thumb/women/10.jpg"
    },
];

export const contains = ({ name, email }, query) => {
    const { first, last } = name;
    if (first.includes(query) || last.includes(query) || email.includes(query)) {
        return true;
    }
    return false;
};

export const getUsers = (limit = 20, query = "") => {
    return new Promise((resolve, reject) => {
        if (query.length === 0) {
            resolve(_.take(users, limit));
        } else {
            const formattedQuery = query.toLowerCase();
            const results = _.filter(users, user => {
                return contains(user, formattedQuery);
            });
            resolve(_.take(results, limit));
        }
    });
};

export default getUsers;
