import 'preact-material-components/LayoutGrid/style.css';
import "preact-material-components/Button/style.css";
import "preact-material-components/Card/style.css";
import { h, Component } from "preact";
import Card from "preact-material-components/Card";
import global from "../globals.css";
import LayoutGrid from 'preact-material-components/LayoutGrid';
import style from "./style";

export default class Home extends Component {
	render() {
		return (
			<div class={global.wrapper}>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12">
							<h1 style="text-align: center;">Care Share App</h1>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="4">
							<div style="background: #e4e4e4; padding: 20px;">
								Thing 1
							</div>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4">
							<div style="background: #e4e4e4; padding: 20px;">
								Thing 2
							</div>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4">
							<div style="background: #e4e4e4; padding: 20px;">
								Thing 3
							</div>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12">
							<div style="background: #e4e4e4; padding: 20px;">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque neque sem, dictum nec urna at, suscipit vehicula mi. Integer non massa interdum, viverra tellus sed, tincidunt orci. In lacinia dui vitae felis eleifend, et vestibulum mauris hendrerit. Maecenas eu nisi congue, mattis mi at, scelerisque metus. Vivamus luctus ac mauris ut porta. Suspendisse rutrum diam non leo iaculis laoreet. Nam semper lorem id nisi varius fermentum. Vestibulum consectetur justo id risus pellentesque, finibus gravida tortor imperdiet. Nulla sed ipsum lectus. 
								<br/><br/>
								Aliquam sit amet aliquet libero. Morbi convallis sed mauris at cursus. Fusce nulla lorem, feugiat a congue id, tempus ut mi. Morbi dignissim felis sed sollicitudin convallis. Aenean at dui metus. Phasellus nec bibendum nisi. Integer non sagittis nisl. 
								<br/><br/>
								Cras non lorem scelerisque, fermentum orci nec, condimentum mi. Nulla luctus luctus erat, in pharetra tellus hendrerit ut. Maecenas tortor lectus, ullamcorper nec dui quis, dignissim interdum turpis. Mauris ac suscipit urna, in faucibus erat. Praesent quis commodo nisi. Proin finibus erat eu enim gravida, ut mattis felis maximus. Pellentesque arcu sem, varius a purus vitae, placerat aliquet urna. In sagittis finibus nisi, in posuere tortor gravida a. Vivamus luctus ligula quis imperdiet consequat. Sed tincidunt placerat dolor ac ultricies.
							</div>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="12">
							<div class={style.bg}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque neque sem, dictum nec urna at, suscipit vehicula mi. Integer non massa interdum, viverra tellus sed, tincidunt orci. In lacinia dui vitae felis eleifend, et vestibulum mauris hendrerit. Maecenas eu nisi congue, mattis mi at, scelerisque metus. Vivamus luctus ac mauris ut porta. Suspendisse rutrum diam non leo iaculis laoreet. Nam semper lorem id nisi varius fermentum. Vestibulum consectetur justo id risus pellentesque, finibus gravida tortor imperdiet. Nulla sed ipsum lectus. 
								<br/><br/>
								Aliquam sit amet aliquet libero. Morbi convallis sed mauris at cursus. Fusce nulla lorem, feugiat a congue id, tempus ut mi. Morbi dignissim felis sed sollicitudin convallis. Aenean at dui metus. Phasellus nec bibendum nisi. Integer non sagittis nisl. 
								<br/><br/>
								Cras non lorem scelerisque, fermentum orci nec, condimentum mi. Nulla luctus luctus erat, in pharetra tellus hendrerit ut. Maecenas tortor lectus, ullamcorper nec dui quis, dignissim interdum turpis. Mauris ac suscipit urna, in faucibus erat. Praesent quis commodo nisi. Proin finibus erat eu enim gravida, ut mattis felis maximus. Pellentesque arcu sem, varius a purus vitae, placerat aliquet urna. In sagittis finibus nisi, in posuere tortor gravida a. Vivamus luctus ligula quis imperdiet consequat. Sed tincidunt placerat dolor ac ultricies.
							</div>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="4">
							<Card>
								<div class={style.cardHeader}>
									<h2 class=" mdc-typography--title">Home card</h2>
									<div class=" mdc-typography--caption">Welcome to home route</div>
								</div>
								<div class={style.cardBody}>
									Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
								</div>
								<Card.Actions>
									<Card.ActionButton>OKAY</Card.ActionButton>
								</Card.Actions>
							</Card>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4">
							<Card>
								<div class={style.cardHeader}>
									<h2 class=" mdc-typography--title">Home card</h2>
									<div class=" mdc-typography--caption">Welcome to home route</div>
								</div>
								<div class={style.cardBody}>
									Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
								</div>
								<Card.Actions>
									<Card.ActionButton>OKAY</Card.ActionButton>
								</Card.Actions>
							</Card>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4">
							<Card>
								<div class={style.cardHeader}>
									<h2 class=" mdc-typography--title">Home card</h2>
									<div class=" mdc-typography--caption">Welcome to home route</div>
								</div>
								<div class={style.cardBody}>
									Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
								</div>
								<Card.Actions>
									<Card.ActionButton>OKAY</Card.ActionButton>
								</Card.Actions>
							</Card>
						</LayoutGrid.Cell>
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}
