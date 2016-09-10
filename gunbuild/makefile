counties.json: gz_2010_us_050_00_20m.shp frequency.csv
	 	../node_modules/.bin/topojson \
	 		-o $@ \
	 		--id-property='STATE+COUNTY,id' \
	 		--external-properties=frequency.csv \
	 		--properties='name=name' \
			--properties='males=+d.properties["males"]' \
			--properties='females=+d.properties["females"]' \
	 		--projection='width = 960, height = 600, d3.geo.albersUsa().scale(1280).translate([width / 2, height / 2])' \
	 		--simplify=.5 \
	 		-- counties=$<

states.json: counties.json
	../node_modules/.bin/topojson-merge \
		  -o $@ \
		  --in-object=counties \
		  --out-object=states \
		  --key='d.id.substring(0, 2)' \
		  -- $<

us.json: states.json
	../node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=states \
		--out-object=nation \
		-- $<
