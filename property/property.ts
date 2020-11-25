namespace $ {

	export class $hyoo_case_property extends $mol_store<
		| boolean
		| string
		| number
		| readonly string[]
		| Record< string , string >
	> {

		id() { return '' }
		entity() { return undefined as any as $hyoo_case_entity }

		domain() { return this.entity().domain() }
		scheme() { return this.domain().entity( this.id() ) }

		filled() {
			return this.data() != null
		}

		locale( lang: string, next? : string ) {

			if( next !== undefined ) {
				if( this.scheme().locale() ) {
					this.data({
						... this.data() as {},
						[ lang ]: next,
					})
				} else {
					this.data( next )
				}
			}

			let value = this.data()

			if( value && ( typeof value === 'object' ) ) {
				value = value[ lang ]
			}
			
			return String( value ?? '' )
		}

		links( next?: $hyoo_case_entity[] ): $hyoo_case_entity[] {
			const domain = this.domain()
			const arg = next === undefined ? undefined : next.map( item => item.id() )
			return ( ( this.data( arg ) as any ?? [] ) as string[] ).map( id => domain.entity( id ) )
		}

		back( index: number ) {
			return this.links()[ index ]?.property( this.scheme().back() ) ?? null
		}

		target_new() {
			const target = this.domain().entity_new()
			target.property( 'scheme' ).target_join( this.scheme().target() )
			this.target_join([ target ])
			return target
		}

		target_join( entities: $hyoo_case_entity[] ) {
			
			const entity = this.entity()
			let links = this.links()
			
			for( const target of entities ) {
				if( links.includes( target ) ) continue
				
				this.links( links = [ ... links, target ] )
				
				const back = target.property( this.scheme().back() )
				back.links([ ... back.links(), entity ])

			}

		}

		target_tear( index: number ) {
			
			if( index < 0 ) return

			const back = this.back( index )
			
			const list = this.links().slice()
			list.splice( index, 1 )
			this.links( list )

			back.target_tear( back.links().indexOf( this.entity() ) )

		}

	}

}
