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

      const {org_id , industry} = req.body

      const query = {
        text: 'SELECT * FROM get_templates_for_user($1, $2)',
        // values: [user_id, search_term || null]
        values: [org_id , industry || null]
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

}

module.exports = Templates;