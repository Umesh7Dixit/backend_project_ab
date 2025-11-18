class Templates {
  constructor(_utility) {
    this.utility = _utility;
  }

  CreateCustomTemplate = async (req, res) => {
    try {
      const { template_name, description, template_payload } = req.body;
      const creator_user_id = req.user.userId; // From JWT token

      // Call the PostgreSQL function
      const query = {
        text: 'SELECT * FROM create_custom_template_from_scratch($1, $2, $3, $4)',
        values: [creator_user_id, template_name, description, JSON.stringify(template_payload)]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows || result.rows.length === 0) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      const { new_template_id, status_message } = result.rows[0];

      if (new_template_id) {
        return this.utility.response.init(res, true, status_message, {
          template_id: new_template_id,
          template_name,
          description
        }, 201);
      } else {
        // Handle database errors (duplicate name, etc.)
        return this.utility.response.init(res, false, status_message, {
          error: "TEMPLATE_CREATION_FAILED"
        }, 400);
      }

    } catch (error) {
      console.error('Error creating custom template:', error);
      return this.utility.response.init(res, false, "Internal server error while creating template", {
        error: "INTERNAL_SERVER_ERROR",
        details: error.message
      }, 500);
    }
  };


  create_custom_temp_template_from_scratch = async (req, res) => {
    try {
      const { template_name, description, template_payload } = req.body;
      const creator_user_id = req.user.userId; // From JWT token

      // Call the PostgreSQL function
      const query = {
        text: 'SELECT * FROM create_custom_temp_template_from_scratch($1, $2, $3, $4)',
        values: [creator_user_id, template_name, description, JSON.stringify(template_payload)]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows || result.rows.length === 0) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      const { new_template_id, status_message } = result.rows[0];

      if (new_template_id) {
        return this.utility.response.init(res, true, status_message, {
          template_id: new_template_id,
          template_name,
          description
        }, 201);
      } else {
        // Handle database errors (duplicate name, etc.)
        return this.utility.response.init(res, false, status_message, {
          error: "TEMPLATE_CREATION_FAILED"
        }, 400);
      }

    } catch (error) {
      console.error('Error creating custom template:', error);
      return this.utility.response.init(res, false, "Internal server error while creating template", {
        error: "INTERNAL_SERVER_ERROR",
        details: error.message
      }, 500);
    }
  };












  GetTemplateDetailsById = async (req, res) => {
    try {
      const { template_id } = req.query;

      const query = {
        text: 'SELECT get_template_details_by_id($1) as template_data',
        values: [template_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows || result.rows.length === 0) {
        return this.utility.response.init(res, false, "Template not found", {
          error: "TEMPLATE_NOT_FOUND"
        }, 404);
      }

      const templateData = result.rows[0].template_data;

      if (!templateData) {
        return this.utility.response.init(res, false, "Template data is empty", {
          error: "EMPTY_TEMPLATE"
        }, 404);
      }

      return this.utility.response.init(
        res,
        true,
        "Template details retrieved successfully",
        {
          template: templateData
        }
      );

    } catch (error) {
      console.error('Error fetching template details:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching template details",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };




  GetTemplatesForUser = async (req, res) => {
    try {

      // const { search_term } = req.query;
      // const user_id = req.user.userId; // From JWT token

      const { org_id, industry } = req.body

      const query = {
        text: 'SELECT * FROM get_templates_for_user($1, $2)',
        // values: [user_id, search_term || null]
        values: [org_id, industry || null]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };

  UpdateExistingCustomTemplate = async (req, res) => {
    try {
      const { template_id, new_name, new_description, new_payload } = req.body;
      const user_id = req.user.userId; // from JWT

      const query = {
        text: 'SELECT public.update_existing_custom_template($1, $2, $3, $4, $5::jsonb) AS message',
        values: [user_id, template_id, new_name, new_description, JSON.stringify(new_payload)]
      };

      const result = await this.utility.sql.query(query);
      const message = result.rows?.[0]?.message || 'No response from database';
      const success = message.toLowerCase().includes('successfully');

      return this.utility.response.init(res, success, message, { message });
    } catch (error) {
      console.error('Error updating template:', error);
      return this.utility.response.init(res, false, 'Failed to update template', { error: error.message }, 500);
    }
  };





  apply_template_to_project = async (req, res) => {
    try {

      const { p_project_id, p_template_id } = req.body

      const query = {
        text: 'SELECT * FROM apply_template_to_project($1, $2)',
        values: [p_project_id, p_template_id || null]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };





  get_template_details_by_id = async (req, res) => {
    try {

      const { p_template_id } = req.body

      const query = {
        text: 'SELECT * FROM get_template_details_by_id($1)',
        values: [p_template_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };


  //does not exist
  get_main_categories_for_scope_and_source = async (req, res) => {
    try {

      const { p_template_id } = req.body

      const query = {
        text: 'SELECT * FROM  get_main_categories_for_scope_and_source($1)',
        values: [p_template_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };


  get_subcategories_for_main_category = async (req, res) => {
    try {
      const { p_main_category_id } = req.body;

      const query = {
        text: 'SELECT * FROM get_subcategories_for_main_category($1)',
        values: [p_main_category_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );
    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };


  get_activities_for_subcategory = async (req, res) => {
    try {

      const { p_main_category, p_subcategory_name } = req.body

      const query = {
        text: 'SELECT * FROM  get_activities_for_subcategory($1,$2)',
        values: [p_main_category, p_subcategory_name]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };


  get_selection1_for_activity = async (req, res) => {
    try {

      const { p_main_category, p_subcategory_name, p_activity_name } = req.body

      const query = {
        text: 'SELECT * FROM  get_selection1_for_activity($1,$2,$3)',
        values: [p_main_category, p_subcategory_name, p_activity_name]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };


  get_selection2_for_selection1 = async (req, res) => {
    try {

      const { p_main_category_id, p_subcategory_name, p_activity_name, p_selection_1_name } = req.body

      const query = {
        text: 'SELECT * FROM  get_selection2_for_selection1($1,$2,$3,$4)',
        values: [p_main_category_id, p_subcategory_name, p_activity_name, p_selection_1_name]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };

  get_emission_factor_for_selection = async (req, res) => {
    try {

      const { p_source, p_scope, p_main_category_id, p_subcategory_name, p_activity_name, p_selection_1_name, p_selection_2_name } = req.body

      const query = {
        text: 'SELECT * FROM  get_emission_factor_for_selection($1,$2,$3,$4,$5,$6,$7)',
        values: [p_source, p_scope, p_main_category_id, p_subcategory_name, p_activity_name, p_selection_1_name, p_selection_2_name]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };



  get_template_usage_percentage = async (req, res) => {
    try {

      const { p_template_id, p_parent_org_id, p_industry } = req.body

      const query = {
        text: 'SELECT * FROM  get_template_usage_percentage($1,$2,$3)',
        values: [p_template_id, p_parent_org_id, p_industry]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Templates retrieved successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };









  save_project_activity_configuration = async (req, res) => {
    try {

      const { p_project_id, p_configured_activities } = req.body

      const query = {
        text: 'SELECT * FROM  save_project_activity_configuration($1,$2)',
        values: [p_project_id, p_configured_activities]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "save_project_activity_configuration  successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };













  copy_template_to_staging_area = async (req, res) => {
    try {

      const { p_project_id, p_template_id } = req.body

      const query = {
        text: 'SELECT * FROM  copy_template_to_staging_area($1,$2)',
        values: [p_project_id, p_template_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "template copy successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };


  get_staged_activities_for_project = async (req, res) => {
    try {

      const { p_project_id } = req.body

      const query = {
        text: 'SELECT * FROM  get_staged_activities_for_project($1)',
        values: [p_project_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "template copy successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };



  append_staged_activity_by_id = async (req, res) => {
    try {
      const { p_project_id, p_subcategory_id, p_frequency } = req.query;

      const query = {
        text: 'SELECT append_staged_activity_by_id($1,$2,$3) as template_data',
        values: [p_project_id, p_subcategory_id, p_frequency]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows || result.rows.length === 0) {
        return this.utility.response.init(res, false, "append_staged_activity_by_id not found", {
          error: "append_staged_activity_by_id_NOT_FOUND"
        }, 404);
      }

      const templateData = result.rows[0].template_data;

      if (!templateData) {
        return this.utility.response.init(res, false, "Template data is empty", {
          error: "EMPTY_TEMPLATE"
        }, 404);
      }

      return this.utility.response.init(
        res,
        true,
        "append_staged_activity_by_id successfully",
        {
          template: templateData
        }
      );

    } catch (error) {
      console.error('Error fetching template details:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching template details",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };




  commit_staged_changes_to_project = async (req, res) => {
    try {

      const { p_project_id } = req.body

      const query = {
        text: 'SELECT * FROM   commit_staged_changes_to_project($1)',
        values: [p_project_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        " commit_staged_changes_to_project successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };




  get_data_collection_sheet_for_scope = async (req, res) => {
    try {

      const { p_project_id, p_scope_name, p_page_size, p_page_number } = req.body

      const query = {
        text: 'SELECT * FROM   get_data_collection_sheet_for_scope($1,$2,$3,$4)',
        values: [p_project_id, p_scope_name, p_page_size, p_page_number]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        " commit_staged_changes_to_project successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };



  upsert_activity_data_batch = async (req, res) => {
    try {

      const { p_project_id, p_user_id, p_data_batch } = req.body

      const query = {
        text: 'SELECT * FROM   upsert_activity_data_batch($1,$2,$3)',
        values: [p_project_id, p_user_id, p_data_batch]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        " commit_staged_changes_to_project successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  };










  create_custom_template_from_scratch = async (req, res) => {
    try {

      const { p_creator_user_id, p_template_name, p_description, p_industry, p_template_payload } = req.body

      const query = {
        text: 'SELECT * FROM  create_custom_template_from_scratch($1,$2,$3,$4,$5)',
        values: [p_creator_user_id, p_template_name, p_description, p_industry, p_template_payload]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "save_project_activity_configuration  successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  }






  // get_data_collection_sheet_for_scope = async (req, res) => {
  //   try {

  //     const { p_project_id, p_scope_name, p_page_size, p_page_number } = req.body

  //     const query = {
  //       text: 'SELECT * FROM get_data_collection_sheet_for_scope($1,$2,$3,$4)',
  //       values: [p_project_id, p_scope_name, p_page_size, p_page_number]
  //     };

  //     const result = await this.utility.sql.query(query);

  //     if (!result.rows) {
  //       return this.utility.response.init(res, false, "No response from database", {
  //         error: "DATABASE_ERROR"
  //       }, 500);
  //     }

  //     return this.utility.response.init(
  //       res,
  //       true,
  //       "save_project_activity_configuration  successfully",
  //       {
  //         templates: result.rows,
  //         count: result.rows.length
  //       }
  //     );

  //   } catch (error) {
  //     console.error('Error fetching templates:', error);
  //     return this.utility.response.init(
  //       res,
  //       false,
  //       "Internal server error while fetching templates",
  //       {
  //         error: "INTERNAL_SERVER_ERROR",
  //         details: error.message
  //       },
  //       500
  //     );
  //   }
  // }





  getUnitById = async (req, res) => {
    try {

      const { unit_id } = req.body

      const query = {
        text: 'SELECT * FROM units WHERE unit_id = $1',
        values: [unit_id]
      };

      const result = await this.utility.sql.query(query);

      if (!result.rows) {
        return this.utility.response.init(res, false, "No response from database", {
          error: "DATABASE_ERROR"
        }, 500);
      }

      return this.utility.response.init(
        res,
        true,
        "Unit fetch successfully",
        {
          templates: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching templates:', error);
      return this.utility.response.init(
        res,
        false,
        "Internal server error while fetching templates",
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        },
        500
      );
    }
  }







}

module.exports = Templates;