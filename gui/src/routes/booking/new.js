import {h, Component} from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/LayoutGrid/style.css';
import global from '../globals';
import style from './style';

export default class BookingNew extends Component {
    render() {
        return (
            <div class={global.wrapper}>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="12">
                            <h1>
                                Create a new booking
                            </h1>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="12">
                            <div class={style.searchBar}>
                                <Icon>search</Icon>
                            </div>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="4">
                            <div class={style.filters}>
                                ....
                            </div>
                            <div class={style.filters}>
                                ////
                            </div>
                            <div class={style.filters}>
                                !!!!!
                            </div>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols="8">
                            <div class={style.results}>

                            </div>
                        </LayoutGrid.Cell>    
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}