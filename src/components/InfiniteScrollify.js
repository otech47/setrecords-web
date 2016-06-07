import React, {PropTypes} from 'react';
import Base from './Base';

export default function(InnerComponent) {
    class InfiniteScrollify extends Base {
        constructor(props) {
            super(props);
            this.autoBind('onScroll');
        }
        componentDidMount() {
            window.addEventListener('scroll', this.onScroll, false);
        }
        componentWillUnmount() {
            window.removeEventListener('scroll', this.onScroll, false);
        }
        onScroll() {
            // console.log('distance scrolled', window.scrollY)
            // console.log('window inner height', window.innerHeight)
            // console.log('total page height', document.body.offsetHeight)

            // must pass onScroll method to instance of wrapped component
            if(this.props.onScroll) {
                if((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
                    console.log('fetching more...');
                    this.props.onScroll();
                }
            }
        }
        render() {
            return <InnerComponent {...this.props} />
        }
    }

    InfiniteScrollify.propTypes = {
        onScroll: PropTypes.func
    };

    return InfiniteScrollify;
}