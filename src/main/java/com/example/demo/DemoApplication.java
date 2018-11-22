package com.example.demo;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@EnableAutoConfiguration
public class DemoApplication {

	@Autowired
	JdbcTemplate jdbcTemplate;

	@RequestMapping("/json")
	String home() {

		String sql = "select id, dado from registro ";//where tipo like '%DISPENSA%' --Or modalidade like '%INEXIGIBILIDADE%'";

		JSONArray arr = new JSONArray();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

		try {

			for (Map <String, Object>row : rows) {
				String reg = row.get("dado").toString();
				JSONObject j = new JSONObject(reg);
				if( !j.has("numero") ) continue;
				j.put("id", row.get("id"));

				arr.put(j);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return arr.toString();
	}

	@RequestMapping("/info")
	String info(@RequestParam(value="id") long id) {
		
		String sql = "select array_to_json(array_agg(tb)) from (\n" + 
				"	select arquivo.nome as nomeArquivo, g.nome as nomeGrupo, g.problema, sb.nome as nomeSubGrupo, r.* from arquivo\n" + 
				"	inner join grupo g on g.idArquivo = arquivo.id\n" + 
				"	inner join subGrupo sb on sb.idGrupo = g.id\n" + 
				"	inner join registro r on r.idSubGrupo = sb.id\n" + 
				"	where r.id = ?\n" + 
				") as tb\n" + 
				"";
		
		String o = jdbcTemplate.queryForObject(sql, new Object[] {id}, String.class );
		
		return o;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
