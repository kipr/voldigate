import { Theme, ThemeProps } from './theme';

import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';

export interface UserProps extends StyleProps, ThemeProps {

}

interface UserState {

}


type Props = UserProps;
type State = UserState;


const Container = styled('div', (props: ThemeProps) => ({
    display: 'flex',
    flexDirection: 'row',
    color: props.theme.color,
    minHeight: '200px',
}));


export class User extends React.PureComponent<Props, State> {

    name: string;
    projects: string[];

    constructor(props: Props, name: string, projects: string[]) {

        super(props);
        this.name = name;
        this.projects = projects;
    }

    render() {
        const { props } = this;
        const {
            style,
            className,
            
        } = props;
        return (
            <></>
        );
    }
}

export default User;