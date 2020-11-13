import * as data from 'words.json';

const buildUrl = ( user, words, is_scheme ) => {

    let q = words.join(" OR ").replace(/\+/g," "),
    val = user.trim().replace( /\u202A/g,"" ).replace( /\u202C/g,"" ),
    scheme = is_scheme == 'on' ? 'https://twitter.com' : 'https://twitter.com';
    // Add @ if missing
    val = val.charAt( 0 ) == '@' ? val : `@${val}`;
    return `${scheme}/search?q=${encodeURIComponent(`${q} from:${val}`)}`;
}

const addOptions = (  ) => {
    let select = document.querySelector( 'select' );

    if( !select || !data.words.length ) return;

    data.words.forEach( ( word ) => {
        let option = document.createElement( 'option' );
        option.value = word;
        option.setAttribute( 'selected', true );
        option.textContent = word.charAt(0).toUpperCase() + word.slice(1);
        select.appendChild( option );
    } );

    // Pass single element
    const element = document.querySelector('.js-choice');
    const choices = new Choices( element, {
        removeItems: true,
        removeItemButton: true,
        addItems: true,
        addItemText: (value) => {
         return `Press Enter to add <b>"${value}"</b>`;
       },
    } );
}

const addBkg = ( ) => {
    if( data.flags && data.flags.length )
        document.querySelector( '.bkg' ).style.background = `var( --flag-${ data.flags[ Math.round( Math.random() * ( data.flags.length - 1 ) + 0 ) ] } )`;
}

const eventsHandler = ( ) => {
    document.querySelector( 'form' ).addEventListener( 'submit', ( e ) => {
        e.preventDefault();

        let datas = new FormData( e.target );

        if( datas.get( 'user' ) ) {
            let url = buildUrl( datas.get( 'user' ), datas.getAll( 'words[]' ), datas.get( 'scheme' ) );

            // Open in other tab
            if( datas.get( 'target' ) && datas.get( 'target' ) == 'on' )
                window.open( url, '_blank');
            else
            location.href = url;
        }

        return false;

    }, false );

    document.querySelector( '.js-sidebar__toggle' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();
        e.stopPropagation();

        let sidebar = document.querySelector( '.js-sidebar' );
        sidebar.classList.toggle( 'is-open' );
        sidebar.toggleAttribute( 'aria-hidden' );

    }, false );

    document.body.addEventListener( 'click', ( e ) => {
        if( e.target.classList.contains( 'js-sidebar' ) || e.target.closest( '.js-sidebar' ) ) return;

        let sidebar = document.querySelector( '.js-sidebar' );
        sidebar.classList.remove( 'is-open' );
        sidebar.removeAttribute( 'aria-hidden' );
    }, false );
}

window.addEventListener( 'load', () => {
    // Add dynamicaly the options
    addOptions();
    // Add bkg flag
    addBkg();
    // Listen
    eventsHandler();
}, false );
