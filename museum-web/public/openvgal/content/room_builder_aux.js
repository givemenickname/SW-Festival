// 원하는 라벨 텍스트
const DOOR_LABELS = {
	"gallery3": "Van Gogh",
	"gallery4": "Monet",
  };
const HIDDEN_ARTWORK_LABEL = "Hidden Artwork!";
  
  // Babylon GUI가 로드됐는지 확인
  function ensureGUI() {
	if (!BABYLON.GUI || !BABYLON.GUI.AdvancedDynamicTexture) {
	  throw new Error("Babylon GUI not loaded. Make sure babylon.gui.min.js is included BEFORE this file.");
	}
  }
  
  // 라벨 플레인 + GUI 텍스트 생성
  /*function makeDoorLabel(mesh, text, scene) {
	ensureGUI();
  
	// 문 앞에 얇은 평면 하나
	const plane = BABYLON.MeshBuilder.CreatePlane(
	  mesh.name + "_customLabel",
	  { width: 1.2, height: 0.35 },
	  scene
	);
	plane.parent = mesh;
  
	// 문 기준으로 약간 위/앞으로
	plane.position = new BABYLON.Vector3(0, 1.6, 0.06);
	// 카메라 쪽 바라보도록 (Y축 빌보드)
	plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
  
	// 이 평면에 GUI 캔버스 올리고 텍스트 추가
	const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane, 512, 256, false);
  
	const rect = new BABYLON.GUI.Rectangle();
	rect.thickness = 0;           // 테두리 없음
	rect.background = "white";    // 흰 배경(원하면 투명도/색 변경 가능)
	gui.addControl(rect);
  
	const tb = new BABYLON.GUI.TextBlock();
	tb.text = text;
	tb.color = "black";
	tb.fontSize = 64;             // 크기
	tb.fontFamily = "sans-serif"; // 폰트
	rect.addControl(tb);
  
	return plane;
  }*/
	function makeDoorLabel(mesh, text, scene) {
		ensureGUI();
	  
		// 문 앞 얇은 평면
		const plane = BABYLON.MeshBuilder.CreatePlane(
		  mesh.name + "_customLabel",
		  { width: 1.4, height: 0.4 },
		  scene
		);
	  
		// 부모는 문 메쉬로 유지
		plane.parent = mesh;
	  
		// 문 정면으로 20cm 정도 앞으로, 살짝 위로
		plane.position = new BABYLON.Vector3(0, 1.6, 0.2);
		// 어느 각도에서든 카메라를 보도록
		plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
	  
		// 조명 영향 받지 않게
		if (plane.material) plane.material.disableLighting = true;
	  
		const gui = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane, 512, 256, false);
	  
		// 흰 배경 + 검은 글자(선명)
		const rect = new BABYLON.GUI.Rectangle();
		rect.thickness = 0;
		rect.background = "white";
		rect.alpha = 1.0;
		gui.addControl(rect);
	  
		const tb = new BABYLON.GUI.TextBlock();
		tb.text = text;
		tb.color = "black";
		tb.fontSize = 72;          // 더 크게
		tb.fontFamily = "sans-serif";
		tb.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		tb.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
		rect.addControl(tb);
	  
		return plane;
	  }
	  
  
  // 씬에 있는 대상 메시에 라벨 붙이기
  function applyDoorLabels(scene) {
	Object.entries(DOOR_LABELS).forEach(([meshName, text]) => {
	  // (1) 문 메쉬(d_galleryX_Y) 또는
	  // (2) 내장 라벨 메쉬(label_galleryX) 중 하나를 타겟으로 삼음
	  const target =
		scene.getMeshByName(meshName) ||
		scene.getMeshByName("label_" + meshName.replace(/^d_/, "").replace(/_\d+$/, ""));
  
	  if (!target) return;
  
	  // 기존 라벨 메쉬가 있으면 안 보이게
	  try { target.visibility = 0; } catch (_) {}
  
	  // 새 라벨 부착
	  makeDoorLabel(target, text, scene);
	});
  }
  
  
  



async function  doDownload(filename, scene) {
	console.log('start download  ' + filename);
	
	await BABYLON.GLTF2Export.GLBAsync(scene, filename).then((glb) => {
	  glb.downloadFiles();
	  console.log('end download  ' + filename);
	});

}


var text3D_builder=function(name, item_position, vector, parent, scene){
	const north_vector=new BABYLON.Vector3(0, 0, 1);
	maxLength=1.3;
	
	texto=name.replace("root", "Hall");
	texto=texto.replace(/d_(.+)_\d+/, "$1");
	
	myText = BABYLON.MeshBuilder.CreateText("T_" + texto, texto, fontContent, {
		size: 0.2,
		resolution: 5, 
		depth: 0.1,
		sideOrientation:2 }, scene);

	//scale it
	scene.executeWhenReady(function () {
		// Assuming the text is aligned along the X axis, measure its length
		myText.refreshBoundingInfo();
		var boundingInfo = myText.getBoundingInfo();
		var textWidth = boundingInfo.maximum.x - boundingInfo.minimum.x;

		// Check if the text exceeds the maximum length
		if (textWidth > maxLength) {
			// Calculate the required scaling factor
			var scaleFactor = maxLength / textWidth;

			// Apply the scaling factor to the text mesh
			myText.scaling.x = scaleFactor;
			myText.scaling.y = scaleFactor; // Optional: Scale uniformly in Y to maintain aspect ratio
			// Note: Adjust Z scaling as needed, or leave it if uniform scaling is desired
		}
	});
	
	//place it
	myText.parent=parent;
	myText.position=new BABYLON.Vector3(item_position.x, item_position.y, item_position.z);
	
	//rotate
	var crossProduct = BABYLON.Vector3.Cross(north_vector, vector);
	// Calculate the dot product and use it to find the angle between vectors
    let dotProduct = BABYLON.Vector3.Dot(north_vector, vector);
    let angle = Math.acos(dotProduct);
	
	// Adjust the angle based on the direction of the cross product
    if (crossProduct.y < 0) {
        angle = -angle;
    }
	//let angle=Math.acos(BABYLON.Vector3.Dot(north_vector, vector)) * Math.sign(crossProduct.y);
		
	myText.rotate(BABYLON.Axis.Y, angle  , BABYLON.Space.LOCAL);
	
	//assign material
	myText.material = BJS_materials["BJS_black_metal"];
		

}

var buildHiddenArtworkMaterial = function(targetMesh, scene, options = {}) {
	ensureGUI();

	const textureSize = options.textureSize || 1024;
	const labelText = options.label || HIDDEN_ARTWORK_LABEL;
	const fontSize = options.fontSize || Math.floor(textureSize * 0.18);

	targetMesh.userData = targetMesh.userData || {};

	if (targetMesh.userData.textGUI) {
		try { targetMesh.userData.textGUI.dispose(); } catch (_) {}
		targetMesh.userData.textGUI = null;
	}

	const guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(targetMesh, textureSize, textureSize, false);
	guiTexture.name = targetMesh.name + "_hidden_gui";

	const background = new BABYLON.GUI.Rectangle();
	background.background = "white";
	background.thickness = 0;
	background.alpha = 1;
	guiTexture.addControl(background);

	const textBlock = new BABYLON.GUI.TextBlock();
	textBlock.text = labelText;
	textBlock.color = "black";
	textBlock.fontWeight = "bold";
	textBlock.fontSize = fontSize;
	textBlock.textWrapping = true;
	textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
	textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
	background.addControl(textBlock);

	if (targetMesh.material) {
		targetMesh.material.disableLighting = true;
		targetMesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
		targetMesh.material.backFaceCulling = false;
	}

	targetMesh.userData.textGUI = guiTexture;
	targetMesh.userData.isRevealed = false;

	return targetMesh.material;
}

var createHiddenArtwork = function(name, item_position, item_size, vector, hidden_material, scene, item_shadow_material=null) {
	// Creates a hidden artwork that shows "Hidden Artwork!" text instead of the image
	// When clicked, it reveals the actual artwork
	
	const shadow_scale=1.3;
	var base_vector=new BABYLON.Vector3(0, 0, 0);
	const north_vector=new BABYLON.Vector3(0, 0, 1);
	var abstractPlane = BABYLON.Plane.FromPositionAndNormal(base_vector, vector);
	
	// Create the artwork plane (initially hidden, will show text)
	var item = BABYLON.MeshBuilder.CreatePlane(name, {sourcePlane: abstractPlane, width:item_size.width, height: item_size.height, sideOrientation: BABYLON.Mesh.SINGLESIDE}, scene);
	item.position = new BABYLON.Vector3(item_position.x, item_position.y, item_position.z).add(vector.scale(3*item_separation/2));
	item.checkCollisions = true;
	
	// Store the actual material for later reveal, but don't apply it yet
	item.userData = { hiddenMaterial: hidden_material, isRevealed: false };
	
	// Apply the white background with centered "Hidden Artwork!" label
	buildHiddenArtworkMaterial(item, scene);
	
	// Create shadow
	if (item_shadow_material!=null) {
		var item_shadow = BABYLON.MeshBuilder.CreatePlane("shadow", {sourcePlane: abstractPlane, width:item_size.width*shadow_scale, height: item_size.height*shadow_scale, sideOrientation: BABYLON.Mesh.SINGLESIDE}, scene);
		item_shadow.position=new BABYLON.Vector3(item_position.x, item_position.y, item_position.z).add(vector.scale(0.01));
		item_shadow.material=item_shadow_material;
		
		let existing_shadow_object=scene.getMeshByName('shadows');
		if (existing_shadow_object){
			var merged_mesh = BABYLON.Mesh.MergeMeshes([existing_shadow_object, item_shadow], true);
			merged_mesh.name="shadows";
		} else {
			item_shadow.name="shadows";
		}
	}
	
	// Create frame
	let item2 = BABYLON.MeshBuilder.CreateBox("box" + name, {
		size: 1, 
		updatable: true
	}, scene);
	item2.position = new BABYLON.Vector3(item_position.x, item_position.y, item_position.z).add(vector.scale(item_separation/2-0.001));
	item2.rotate(BABYLON.Axis.Y, Math.acos(BABYLON.Vector3.Dot(vector, north_vector)), BABYLON.Space.LOCAL);
	item2.scaling = new BABYLON.Vector3(item_size.width+margin, item_size.height+margin, item_separation);
	
	let existing_frame_object=scene.getMeshByName('frames');
	if (existing_frame_object){
		var merged_mesh = BABYLON.Mesh.MergeMeshes([existing_frame_object, item2], true);
		merged_mesh.name="frames";
	} else {
		item2.name="frames";
	}
	
	// Store reference for cleanup (no overlay plane needed anymore)
	item.userData.textPlane = null;
	
	// Note: The item's action manager will be set up in index.html to handle both reveal and normal interaction
	
	return item;
}

var resetHiddenArtworks = function(scene) {
	// Resets all hidden artworks to their initial "Hidden Artwork!" state
	// This allows the reveal action to be done again every time you enter the gallery
	
	scene.meshes.forEach((mesh) => {
		// Check if this is a hidden artwork (has hiddenMaterial in userData) and is currently revealed
		if (mesh.userData && mesh.userData.hiddenMaterial && mesh.userData.isRevealed === true) {
			// Reset the revealed state
			mesh.userData.isRevealed = false;
			
			// Restore the "Hidden Artwork!" material
			buildHiddenArtworkMaterial(mesh, scene);
		}
	});
}

var item_builder= function(name, item_position, item_size, vector, material,scene, item_shadow_material=null){
	//places artwork as an image texture
	//adds a frame and both elements have a customizable separation from the wall
	//the thickness of the frame is half the separation
	
	const shadow_scale=1.3;
	var base_vector=new BABYLON.Vector3(0, 0, 0);
	const north_vector=new BABYLON.Vector3(0, 0, 1);
	var abstractPlane = BABYLON.Plane.FromPositionAndNormal(base_vector,vector );
	var item = BABYLON.MeshBuilder.CreatePlane(name, {sourcePlane: abstractPlane, width:item_size.width, height: item_size.height, sideOrientation: BABYLON.Mesh.SINGLESIDE},scene);

	//create the item shadow
	if (item_shadow_material!=null) {
		var item_shadow = BABYLON.MeshBuilder.CreatePlane("shadow", {sourcePlane: abstractPlane, width:item_size.width*shadow_scale, height: item_size.height*shadow_scale, sideOrientation: BABYLON.Mesh.SINGLESIDE},scene);
		item_shadow.position=new BABYLON.Vector3(item_position.x, item_position.y, item_position.z).add(vector.scale(0.01));
		item_shadow.material=item_shadow_material;
		
		let existing_shadow_object=scene.getMeshByName('shadows');
		if (existing_shadow_object){
			var merged_mesh = BABYLON.Mesh.MergeMeshes([existing_shadow_object, item_shadow], true);
			merged_mesh.name="shadows";
		} else {
			item_shadow.name="shadows";
		}

	}
	
	
	//the position is shifted away from the wall in the direction of the item vector (normal)
	item.position=new BABYLON.Vector3(item_position.x, item_position.y, item_position.z).add(vector.scale(3*item_separation/2));
	item.checkCollisions= true;
	if (material!=  undefined){
		item.material=material;
		item.material.specularColor=new BABYLON.Color3(0,0,0);
		
	}



	// Create the box at the position of the base vector with the plane's rotation
	let item2 = BABYLON.MeshBuilder.CreateBox("box" +name, {
		size: 1, 
		updatable: true
	}, scene);

	// Set the position, rotation and scale of the box/frame
	item2.position = new BABYLON.Vector3(item_position.x, item_position.y, item_position.z).add(vector.scale(item_separation/2-0.001));
	item2.rotate(BABYLON.Axis.Y,  Math.acos(BABYLON.Vector3.Dot(vector, north_vector)), BABYLON.Space.LOCAL);
	item2.scaling = new BABYLON.Vector3(item_size.width+margin, item_size.height+margin, item_separation); 
	
	
	//check if the mesh that merges all the frames is already created
	let existing_frame_object=scene.getMeshByName('frames');
	if (existing_frame_object){
		var merged_mesh = BABYLON.Mesh.MergeMeshes([existing_frame_object, item2], true);
		merged_mesh.name="frames";
	} else {
		item2.name="frames";
	}





	return item
}

function populate_template(config_file, room_name,scene){

    let item_size=config_file["Technical"]["scaleFactor"];		 //parameter controlling the scale of the items
	
	const vector_n=new BABYLON.Vector3(0, 0, 1);
	const vector_s=new BABYLON.Vector3(0, 0, -1);
	const vector_e=new BABYLON.Vector3(1, 0, 0);
	const vector_w=new BABYLON.Vector3(-1, 0, 0);
	
	//position the items
	// get all the non image items
	var gallery=config_file[room_name];
	var dict_items=Object.keys(gallery).filter(key => gallery[key]["resource_type"]== "image");
	num_items=dict_items.length;

	//get frame shadow material
	var shadow_texture = new BABYLON.Texture(materials_folder +"/shadow.png", scene, false, BABYLON.Texture.LINEAR_LINEAR);
	shadow_texture.hasAlpha=true;
	
	var item_shadow_material = new BABYLON.StandardMaterial("shadow_mat", scene);
	item_shadow_material.specularColor=new BABYLON.Color3(0,0,0);
	item_shadow_material.diffuseTexture = shadow_texture;
	item_shadow_material.useAlphaFromDiffuseTexture = true;
	
	let i=3
	let itemIndex = 0;
	for (var item of dict_items){
		//get location
		let location=JSON.parse(gallery[item]["location"])
		
		//get material
		let items_material=new BABYLON.StandardMaterial("item_mat_"+ item);
		items_material.freeze();
		items_material.specularColor=new BABYLON.Color3(0,0,0);
		items_material.maxSimultaneousLights=max_lights;
		let tex=new BABYLON.Texture(hallspics_prefix + gallery[item]["resource"], scene);
		items_material.diffuseTexture=tex;
		
		//get orientation
		let orientation=JSON.parse(gallery[item]["vector"])
		orientation=new BABYLON.Vector3(orientation[0], 0, orientation[1])
		
		//get sizse
		scaled_width=item_size*gallery[item]["width"];
		scaled_height=item_size*gallery[item]["height"];
		
		// Check if this is the last artwork in galleries that support hidden items
		const galleriesWithHiddenArtworks = ["gallery3", "gallery4"];
		let isHiddenArtwork = (galleriesWithHiddenArtworks.includes(room_name) && itemIndex === dict_items.length - 1);
		
		if (isHiddenArtwork) {
			// Create hidden artwork with text instead of image
			createHiddenArtwork(item + "_" + i, {x:location[0], y:location[2], z:location[1]}, {width:scaled_width, height:scaled_height}, orientation, items_material, scene, item_shadow_material);
		} else {
			//notice that y and z are flippped
			item_builder(item + "_" + i ,{x:location[0], y:location[2], z:location[1]}, {width:scaled_width, height:scaled_height}, orientation, items_material, scene, item_shadow_material); 
		}
		
		//update loading bar
		tex.onLoadObservable.add(((j) => {
			return() => {
				percentage_artwork=percentage_artwork + j;
				const round_per=Math.round(percentage_artwork);
				document.getElementById("percentLoaded_artwork").innerHTML = `${round_per}%`;
				document.getElementById("loadingBar_artwork").style.width =`${round_per}%`;
				if (round_per==100){
					//finish load bar
					reset_loadbar();
				}
		
			};
		})(100/num_items));

		
		i=i+1;
		itemIndex++;
	}
	
	if (dict_items.length>0)	{
		scene.getMeshByName("frames").createNormals(true);
		scene.getMeshByName("frames").material=BJS_materials[frame_material];
	} else {
		reset_loadbar();
	}
	

	
	//locate doors in the json file
	var renamed_doors=0;
	dict_items=Object.keys(gallery).filter(key => gallery[key]["resource_type"]== "door");
	max_doors=dict_items.length;
	
	//go through the mesh check for doors and replace materials
	scene.meshes.map((mesh) => {

		if ((mesh.material != null) && mesh.material.name.startsWith("BJS_")){
			console.log("updating material " + mesh.material.name);
			let temp_name=mesh.material.name;
			mesh.material=BJS_materials[temp_name];
			mesh.material.maxSimultaneousLights =max_lights;
		}
		
		if (regul_exp_door.test(mesh.name)){
			if (renamed_doors >= max_doors){ //delete the door from the mesh
				mesh.name="dummydoor" + renamed_doors;
								
			} else {
				mesh.name="d_" + dict_items[renamed_doors] + "_" + renamed_doors;
				normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
				normal = new BABYLON.Vector3(normals[0], normals[1], normals[2]);

				//put text
				//text3D_builder(dict_items[renamed_doors].replace("#", " "), mesh.position, normal, mesh.parent, scene);
				let doorName = dict_items[renamed_doors].replace("#", " ");
				doorName = DOOR_LABELS[doorName] || doorName;
				text3D_builder(doorName, mesh.position, normal, mesh.parent, scene);
			}
			renamed_doors++;
		}
	});
	
	if (renamed_doors < max_doors){
		console.log("ERROR: Some doors in the json are not present in the template");
	}

		

	
	//remove replaced materials
	scene.materials.forEach(material => {
		if (material.name.startsWith('BJS_'))
			material.dispose(); 
		
	});
	// 여기 추가함
	applyDoorLabels(scene);
}	


function reset_loadbar(){
	percentage_materials=0;
	percentage_template=0;
	percentage_artwork=0;	
	document.getElementById("loader").style.display = "none";
	document.getElementById("loader").id= "loaded";
	document.getElementById("percentLoaded_template").innerHTML = `${percentage_template}%`;
	document.getElementById("loadingBar_template").style.width =`${percentage_template}%`;
	document.getElementById("percentLoaded_materials").innerHTML = `${percentage_materials}%`;
	document.getElementById("loadingBar_materials").style.width =`${percentage_materials}%`;
	document.getElementById("percentLoaded_artwork").innerHTML = `${percentage_artwork}%`;
	document.getElementById("loadingBar_artwork").style.width =`${percentage_artwork}%`;
}

function manual_move(){
	//get active camera
	const camera = scene.activeCamera;
	const camera_distance = 3;


	var gallery=config_file_content[current_gallery];
	var dict_items=Object.keys(gallery).filter(key => gallery[key]["resource_type"]== "image");
	var n_items=dict_items.length;

	//check limits
	if (manual_navigation_idx<0){
		manual_navigation_idx= n_items-1;
	} else if (manual_navigation_idx ==n_items){
		manual_navigation_idx=0;
	}


	//get position and vector. Assuming they are JSON strings of 3-element arrays [x, y, z]
	let item_position_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['location']);
	let item_vector_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['vector']);

	// Create Babylon.js Vector3 objects
	const target_position = new BABYLON.Vector3(item_position_array[0], item_position_array[2], item_position_array[1]);
	const target_vector = new BABYLON.Vector3(item_vector_array[0], item_vector_array[2], item_vector_array[1]).normalize();

	// Calculate the camera's position to be in front of the item
	const camera_position = target_position.add(target_vector.scale(camera_distance));

	// Aim the camera at the target
	camera.position = camera_position;
	camera.setTarget(target_position);

	showInfoBox("Title:  " + gallery[dict_items[manual_navigation_idx]]["metadata"]);


}
	
