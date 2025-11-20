const _utility = require('./modules/utility.js');
// const _common               = require('./modules/common.js');
const _dashboard = require('./modules/dashboard.js');
const _register = require('./modules/registeruser.js');
const _facilities = require('./modules/facilities.js');
const _projectActivities = require('./modules/projectActivities.js');
const _taskComments = require('./modules/taskComments.js');
const validationSchemas = require('./middlewares/validationSchemas.js');
const ValidationMiddleware = require('./middlewares/validate.js');
const upload = require('./middlewares/upload.js');
const _templates = require('./modules/templates.js');
// const _anomalyFlags = require('./modules/anomalyFlags.js');

const cors = require('cors');

const utility = new _utility();

// Validation
const validation = ValidationMiddleware(utility);

const register = new _register(utility);
const facilities = new _facilities(utility);
const projectActivities = new _projectActivities(utility);
const taskComments = new _taskComments(utility);
const templates = new _templates(utility);
// const anomalyFlags = new _anomalyFlags(utility);

const compression = require('compression');
utility.app.use(compression());

const helmet = require('helmet');
utility.app.use(helmet());
const bodyParser = require('body-parser');


utility.app.use(utility.express.json())
utility.app.use(bodyParser.json());
utility.app.use(bodyParser.json({ limit: '100mb' }));
utility.app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// utility.app.use(utility.bodyParser.json());



// utility.app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

utility.app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));




const dotenv = require('dotenv');


if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.local' });
}



// Old 
// utility.app.post('/UserLogin' ,                                                                 register.UserLogin);

// New

// utility.app.post('/user/login', 
//   validation.validate(validationSchemas.login),
//   register.UserLogin
// );

utility.app.post('/user/login', (req, res, next) => {
  next();
},
  validation.validate(validationSchemas.login),
  (req, res, next) => {
    next();
  },
  register.UserLogin
);


utility.app.post('/user/logout',
  utility.authenticateToken,
  register.UserLogout
);

utility.app.post('/user/update-password',
  utility.authenticateToken,
  validation.validate(validationSchemas.updatePassword),
  register.UpdateUserPassword
);

utility.app.post('/auth/register',
  validation.validate(validationSchemas.registerUser),
  register.RegisterUser
);
// Facilities
utility.app.get('/facilities/search',
  utility.authenticateToken,
  facilities.searchFacilitiesByUser
);

utility.app.get('/facilities/accessible',
  utility.authenticateToken,
  validation.validate(validationSchemas.getAccessibleFacilities, 'query'),
  facilities.GetAccessibleFacilities
);

// Project Activities
utility.app.post('/project/add',
  utility.authenticateToken,
  validation.validate(validationSchemas.addProjectActivity),
  projectActivities.AddActivityToProject
);

utility.app.post('/project/check-unresolved-flags',
  utility.authenticateToken,
  validation.validate(validationSchemas.checkUnresolvedFlags),
  projectActivities.CheckUnresolvedFlags
);

utility.app.post('/project/create-tasks',
  utility.authenticateToken,
  validation.validate(validationSchemas.createProjectRequest),
  projectActivities.CreateProjectRequest
);

utility.app.post('/project/create',
  utility.authenticateToken,
  validation.validate(validationSchemas.createProject),
  projectActivities.CreateProject
);

utility.app.put('/project/customize-scopes',
  utility.authenticateToken,
  validation.validate(validationSchemas.customizeActiveScopes),
  projectActivities.CustomizeActiveScopes
);

utility.app.get('/project/data-collection-sheet/scope',
  utility.authenticateToken,
  validation.validate(validationSchemas.getDataCollectionSheetForScope, 'query'),
  projectActivities.GetDataCollectionSheetForScope
);

utility.app.get('/activities/subcategory',
  utility.authenticateToken,
  validation.validate(validationSchemas.getActivitiesForSubcategory, 'query'),
  projectActivities.GetActivitiesForSubcategory
);

utility.app.get('/user/requests',
  utility.authenticateToken,
  validation.validate(validationSchemas.getAllRequestsForUser),
  projectActivities.GetAllRequestsForUser
);

utility.app.get('/users/assignable',
  utility.authenticateToken,
  validation.validate(validationSchemas.getAssignableUsers),
  projectActivities.GetAssignableUsers
);

utility.app.get('/project/export-data',
  utility.authenticateToken,
  validation.validate(validationSchemas.getDataForExport, 'query'),
  projectActivities.GetDataForExport
);

utility.app.get('/categories/main',
  utility.authenticateToken,
  validation.validate(validationSchemas.getMainCategoriesForScopeAndSource, 'query'),
  projectActivities.GetMainCategoriesForScopeAndSource
);

utility.app.get('/project/preview-data/scope',
  utility.authenticateToken,
  validation.validate(validationSchemas.getPreviewDataForScope, 'query'),
  projectActivities.GetPreviewDataForScope
);

utility.app.get('/activities/selection1-options',
  utility.authenticateToken,
  validation.validate(validationSchemas.getSelection1ForActivity, 'query'),
  projectActivities.GetSelection1ForActivity
);

utility.app.get('/activities/selection2-options',
  utility.authenticateToken,
  validation.validate(validationSchemas.getSelection2ForSelection1, 'query'),
  projectActivities.GetSelection2ForSelection1
);

utility.app.get('/categories/subcategories',
  utility.authenticateToken,
  validation.validate(validationSchemas.getSubcategoriesForMainCategory, 'query'),
  projectActivities.GetSubcategoriesForMainCategory
);

utility.app.post('/projects/initialize',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.initializeNewProject),
  projectActivities.InitializeNewProject
);

utility.app.post('/flags/ignore',
  utility.authenticateToken,
  validation.validate(validationSchemas.resolveAnomalyFlagAsIgnored),
  projectActivities.ResolveAnomalyFlagAsIgnored
);



utility.app.post('/validations/run',
  utility.authenticateToken,
  validation.validate(validationSchemas.runAllValidationsForScope),
  projectActivities.RunAllValidationsForScope
);

utility.app.post('/activities/batch',
  utility.authenticateToken,
  validation.validate(validationSchemas.upsertActivityDataBatch),
  projectActivities.UpsertActivityDataBatch
);

// Task Comments
utility.app.post('/task-comments/add',
  utility.authenticateToken,
  validation.validate(validationSchemas.addTaskComment),
  taskComments.AddCommentToTask
);

utility.app.get('/request/thread',
  utility.authenticateToken,
  validation.validate(validationSchemas.getRequestThreadDetails, 'query'),
  taskComments.GetRequestThreadDetails
);

// Templates
utility.app.post('/templates/create-custom',
  utility.authenticateToken,
  validation.validate(validationSchemas.createCustomTemplate),
  templates.CreateCustomTemplate
);

// temp1
utility.app.post('/templates/apply_template_to_project',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.apply_template_to_project
);

// temp2
utility.app.post('/templates/get_template_details_by_id',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_template_details_by_id
);




//temp3
utility.app.post('/get_subcategories_for_main_category',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_subcategories_for_main_category
);

//temp4
utility.app.post('/get_activities_for_subcategory',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_activities_for_subcategory
);

//temp5
utility.app.post('/get_selection1_for_activity',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_selection1_for_activity
);

//temp6
utility.app.post('/get_selection2_for_selection1',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_selection2_for_selection1
);

//temp7
utility.app.post('/get_emission_factor_for_selection',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_emission_factor_for_selection
);

//temp8
utility.app.post('/get_template_usage_percentage',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_template_usage_percentage
);


//temp9
utility.app.post('/save_project_activity_configuration',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.save_project_activity_configuration
);


//temp10
utility.app.post('/create_custom_template_from_scratch',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.create_custom_template_from_scratch
);


utility.app.post('/copy_template_to_staging_area',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.copy_template_to_staging_area
);

utility.app.post('/get_staged_activities_for_project',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_staged_activities_for_project
);


utility.app.post('/append_staged_activity_by_id',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.append_staged_activity_by_id
);

utility.app.post('/commit_staged_changes_to_project',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.commit_staged_changes_to_project
);


//temp10
utility.app.post('/create_custom_temp_template_from_scratch',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.create_custom_temp_template_from_scratch
);



utility.app.post('/run_all_validations_for_project',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.run_all_validations_for_project
);

utility.app.post('/get_project_review_data',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_project_review_data
);

utility.app.post('/submit_project_for_approval',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.submit_project_for_approval
);

utility.app.post('/get_approval_status_for_project',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_approval_status_for_project
);


utility.app.post('/upload_document_for_activity',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.upload_document_for_activity
);

//temp11
utility.app.post('/get_data_collection_sheet_for_scope',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_data_collection_sheet_for_scope
);



//temp12
utility.app.post('/getUnitById',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.getUnitById
);



//new
utility.app.post('/get_data_collection_sheet_for_scope',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.get_data_collection_sheet_for_scope
);



utility.app.post('/upsert_activity_data_batch',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.upsert_activity_data_batch
);


utility.app.post('/update_project_member_permission',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.createCustomTemplate),
  templates.update_project_member_permission
);









utility.app.get('/templates/details',
  utility.authenticateToken,
  validation.validate(validationSchemas.getTemplateDetailsById, 'query'),
  templates.GetTemplateDetailsById
);

// utility.app.get('/templates/list',  
utility.app.post('/templates/list',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.getTemplatesForUser, 'query'),
  templates.GetTemplatesForUser
);

utility.app.post('/project/apply-template',
  utility.authenticateToken,
  validation.validate(validationSchemas.applyTemplateToProject),
  projectActivities.ApplyTemplateToProject
);

utility.app.post('/project/save-activity-config',
  utility.authenticateToken,
  validation.validate(validationSchemas.saveProjectActivityConfiguration),
  projectActivities.SaveProjectActivityConfiguration
);

utility.app.post('/createNewFacility',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.saveProjectActivityConfiguration),
  upload.fields([
    { name: "p_id_document", maxCount: 1 },
    { name: "p_tax_document", maxCount: 1 }
  ]),
  facilities.createNewFacility
);


// _______________________________________________________________

//parameter :- 
// {
//   "p_org_id": 5
// }

utility.app.post('/get_assignable_users_for_org',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.saveProjectActivityConfiguration),
  projectActivities.get_assignable_users_for_org
);

// _______________________________________________________________




utility.app.put('/templates/update',
  utility.authenticateToken,
  validation.validate(validationSchemas.updateExistingCustomTemplate),
  templates.UpdateExistingCustomTemplate
);





utility.app.post('/getorg_name_and_id',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.saveProjectActivityConfiguration),
  facilities.getorg_name_and_id
);




utility.app.post('/add_new_member_to_project',
  // utility.authenticateToken,
  // validation.validate(validationSchemas.saveProjectActivityConfiguration),
  templates.add_new_member_to_project
);




utility.app.post('/update_project_member_permission',
  templates.update_project_member_permission
);



utility.app.post('/remove_member_from_project',
  templates.remove_member_from_project
);



// utility.app.post('/userlogout' ,                                    utility.authenticateToken,  register.userlogout);














// ______________Upload Functionality________________________________

 




const csv = require("csv-parser");
const multer = require("multer");


const upload2 = multer({ storage: multer.memoryStorage() });
 

const { Readable } = require("stream");

utility.app.post("/upload-csv", upload2.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File not found" });
        }

        let raw = req.file.buffer.toString("latin1");

         
        raw = raw.replace(/^\uFEFF/, "");

        raw = raw.replace(/\u00A0/g, " ");

        let delimiter = raw.includes("\t") ? "\t" : ",";

        const results = [];

         Readable.from(raw.split(/\r?\n/))
    .pipe(
        csv({
            separator: delimiter,
            mapHeaders: ({ header }) =>
                header
                    .trim()
                    .toLowerCase()
                    .replace(/[\s]+/g, "_")
        })
    )

            .on("data", (row) => {
                
                const clean = {};
                Object.keys(row).forEach((k) => {
                    let key = k.trim().toLowerCase().replace(/[\s]+/g, "_");
                    clean[key] = (row[k] || "").toString().trim();
                });

              
                const obj = {
                    project_activity_id: Number(clean.project_activity_id) || null,
                    main_category: clean.main_category || "",
                    sub_category: clean.sub_category || "",
                    activity: clean.activity || "",
                    selection_1: clean.selection_1 || "",
                    selection_2: clean.selection_2 || "",
                    unit: clean.unit || "",
                    monthly_data: {},
                    subcategory_id: 124
                };

                 
                Object.keys(clean).forEach((key) => {
                    if (
                        ![
                            "project_activity_id",
                            "main_category",
                            "sub_category",
                            "activity",
                            "selection_1",
                            "selection_2",
                            "unit"
                        ].includes(key)
                    ) {
                        if (clean[key] !== "") {
                            obj.monthly_data[key.replace(/-/g, " ")] = {
                                quantity: Number(clean[key]) || 0
                            };
                        }
                    }
                });

                results.push(obj);
            })
            .on("end", () => {
                res.json({
                    issuccessful: true,
                    message: "Data Parsed successfully",
                    data: {
                        templates: results,
                        count: results.length
                    }
                });
            });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            issuccessful: false,
            message: "Internal server error",
            error: err.message
        });
    }
});







utility.app.get('/', (req, res) => {
  res.send("Hello I am working");
})

utility.app.listen(utility.port, () => {
  console.log(`Example app listening on port ${utility.port}`)
})





