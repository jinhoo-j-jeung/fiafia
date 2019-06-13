import _ from 'lodash';


export const groups = [
    { name: 'FiaFia', code: '#1abc9c', description: "Project-based SNS developed in React Native", image_url: 'https://reactnativecode.com/wp-content/uploads/2018/01/2_img.png' },
    { name: 'Hobby', code: '#2ecc71', description: "Hobby-based SNS similar to Band", image_url: 'https://i.imgur.com/TyCSG9A.png'  },
    { name: 'GradingSecured', code: '#3498db', description: "CS465 project developed in Android", image_url: 'https://www.thesoulwithin.com/wp-content/uploads/2018/04/ios-logo.png' },
    { name: 'Awesome Game', code: '#9b59b6', description: "Awesome!", image_url: 'http://www.newgamesbox.net/wp-content/uploads/2018/03/Rage-In-Peace-Free-Download-Full-Version-PC-Game-Setup.jpg'  },
    { name: 'VFridge', code: '#34495e', description: "Fridge management application (Android, IOS, Spring)", image_url: 'https://png.pngtree.com/element_origin_min_pic/16/07/10/185782277cb0ccf.jpg'  },
    { name: 'Help Wanted', code: '#16a085', description: "Group offering help in debugging", image_url: 'http://nancyspoint.com/wp-content/uploads/2016/01/help1.gif'  },
    { name: 'Music App', code: '#27ae60', description: "", image_url: 'https://www.thoughtco.com/thmb/ibRsMUGDeErA9OnwaLaOa8Ujw2E=/800x0/filters:no_upscale():max_bytes(150000):strip_icc()/tax2_image_music-58a22d1668a0972917bfb557.png'  },
    { name: 'MyBus', code: '#2980b9', description: "CUMTD bus application", image_url: 'http://www.supercoloring.com/sites/default/files/styles/coloring_medium/public/cif/2015/07/cartoon-bus-coloring-page.png'  },
    { name: 'Treello', code: '#8e44ad', description: "Something like Trello but different.", image_url: 'https://pbs.twimg.com/profile_images/1055830869699686401/3tc-hGSS_400x400.jpg'  },
    { name: 'UIUC Projects App ', code: '#2c3e50', description: "react-native-elements@0.19.1", image_url: 'https://pbs.twimg.com/profile_images/971799302786965504/B3245znn.jpg'  }
];

export const contains = ({ name, description }, query) => {
    const formattedName = name.toLowerCase();
    const formattedDescription = description.toLowerCase();
    if (formattedName.includes(query) || formattedDescription.includes(query)) {
        return true;
    }
    return false;
};

export const getGroups = (limit = 20, query = "") => {
    return new Promise((resolve, reject) => {
        if (query.length === 0) {
            resolve(_.take(groups, limit));
        } else {
            const formattedQuery = query.toLowerCase();
            const results = _.filter(groups, group => {
                return contains(group, formattedQuery);
            });
            resolve(_.take(results, limit));
        }
    });
};

export default getGroups;
