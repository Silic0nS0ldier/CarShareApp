import {h, Component} from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/LayoutGrid/style.css';

import style from './style';

export default class VehicleListing extends Component {
    render() {
        return (
            <div>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="12">
                            <h1>
                                Car Listing Title
                            </h1>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols="8">
                            <div class={style.divSpacer + " " + style.gallery}>
                                IMG GALL
                            </div>
                            <div class={style.divSpacer + " " + style.listingInfo}>
                                <div class={style.centreText}>
                                    <LayoutGrid.Inner>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                Make: Toyota
                                            </div>
                                        </LayoutGrid.Cell>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                Model: Yaris
                                            </div>
                                        </LayoutGrid.Cell>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                KMS: 190,000
                                            </div>
                                        </LayoutGrid.Cell>
                                    </LayoutGrid.Inner>
                                    <LayoutGrid.Inner>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                Make: Toyota
                                            </div>
                                        </LayoutGrid.Cell>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                Model: Yaris
                                            </div>
                                        </LayoutGrid.Cell>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                KMS: 190,000
                                            </div>
                                        </LayoutGrid.Cell>
                                    </LayoutGrid.Inner>
                                    <LayoutGrid.Inner>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                Make: Toyota
                                            </div>
                                        </LayoutGrid.Cell>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                Model: Yaris
                                            </div>
                                        </LayoutGrid.Cell>
                                        <LayoutGrid.Cell cols="4">
                                            <div class={style.divSpacerMini}>
                                                KMS: 190,000
                                            </div>
                                        </LayoutGrid.Cell>
                                    </LayoutGrid.Inner>
                                </div>
                            </div>
                            <div class={style.divSpacer + " " + style.desc}>
                                Description
                            </div>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols="4">
                            <div class={style.divSpacer + " " + style.owner}>
                                Thing 1
                            </div>
                            <div class={style.divSpacer + " " + style.dates}>
                                Thing 2
                            </div>
                            <div class={style.divSpacer + " " + style.reviews}>
                                Thing 4
                            </div>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}