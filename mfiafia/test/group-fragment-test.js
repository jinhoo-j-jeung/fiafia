//__tests__/group-fragment.test.js
import 'react-native';
import React from 'react';
import GetGroups from 'src/api/GetGroups'
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const tree = renderer.create(
        <GetGroups />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});