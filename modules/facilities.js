class Facilities {
  constructor(utility) {
    this.utility = utility;

    this.searchFacilitiesByUser = this.searchFacilitiesByUser.bind(this);
  }
  async searchFacilitiesByUser(req, res) {
    try {
      const isGet = req.method === 'GET';
      const userId = isGet ? parseInt(req.query.user_id, 10) : parseInt(req.body.user_id, 10);
      const searchTerm = isGet ? (req.query.search_term || '').trim() : (req.body.search_term || '').trim();

      if (!Number.isInteger(userId)) {
        return this.utility.response.init(res, false, "Invalid or missing 'user_id'.");
      }
      if (!searchTerm) {
        return this.utility.response.init(res, false, "Invalid or missing 'search_term'.");
      }

      const query = {
        text: 'SELECT * FROM public.search_facilities_by_user($1, $2);',
        values: [userId, searchTerm],
      };

      const result = await this.utility.sql.query(query);

      return this.utility.response.init(
        res,
        true,
        "Facilities fetched successfully",
        { rows: result.rows }
      );
    } catch (err) {
      console.error("searchFacilitiesByUser error:", err);
      return this.utility.response.init(res, false, "Internal server error");
    }
  }

  GetAccessibleFacilities = async (req, res) => {
    try {
      const { search_term } = req.query;
      const user_id = req.user.userId; // Get from JWT token
      console.log("search_term ", search_term);
      console.log("user_id ", user_id);

      const query = {
        text: 'SELECT * FROM get_accessible_facilities_for_user($1, $2)',
        values: [user_id, search_term || '']
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
        "Facilities fetched successfully",
        { 
          facilities: result.rows,
          count: result.rows.length
        }
      );

    } catch (error) {
      console.error('Error fetching accessible facilities:', error);
      return this.utility.response.init(
        res, 
        false, 
        "Internal server error while fetching facilities", 
        {
          error: "INTERNAL_SERVER_ERROR",
          details: error.message
        }, 
        500
      );
    }
  };


//   createFacility = async(req, res) => {
//       try {
//         const {  p_org_id,  p_name,  type,  industry,  registration_number,  admin_name,  admin_email,  admin_phone,  address_line1,  city,  state,  country,  postal_code,  office_mail,  office_phone,  id_document,  tax_document  } = req.body;

//         // Basic validation
//         if (!org_id || !name) {
//           return this.utility.response.init(res, false, "org_id and name are required");
//         }

// const query = `
//   SELECT * FROM fn_create_facility(
//     $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
//   )
// `;

// const values = [
//   p_org_id, p_name, p_type, p_industry, p_registration_number, p_admin_name,
//   p_admin_email, p_admin_phone, p_address_line1, p_city, p_state,
//   p_country, p_postal_code, p_office_mail, p_office_phone,
//   p_id_document, p_tax_document
// ];

// const result = await pool.query(query, values);
// console.log(result.rows[0]);

//         console.log(query);

//         // const result = await this.utility.sql.query(query);

//         console.log("result->>",result);

//             if (!result.rows) {
//               return this.utility.response.init(res, false, "No response from database", {
//                 error: "DATABASE_ERROR"
//               }, 500);
//             }


//         return this.utility.response.init(  res,  true,  "Facility created successfully",  { result: result.rows }   );

//       } catch (err) {
//         console.error("createFacility error:", err);
//         return this.utility.response.init(res, false, "Internal server error");
//       }
//   }


createNewFacility = async (req, res) => {
  try {  
    const {
      p_org_id,
      p_facility_name,
      p_gst_number,
      p_admin_name,
      p_admin_email,
      p_admin_phone,
      p_address_line1,
      p_city,
      p_state,
      p_country,
      p_postal_code,
      p_id_document,
      p_tax_document
      
      // p_name,
      // p_type,
      // p_industry,
      // p_registration_number,
      // p_office_mail,
      // p_office_phone,

    } = req.body;

    // ✅ Basic validation
    // if (!p_org_id || !p_name) {
    //   return this.utility.response.init(res, false, "p_org_id and p_name are required");
    // }

    const query =  {
    text : `SELECT * FROM public.create_new_facility( 
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13 )`,
    values : [
      p_org_id,
      p_facility_name,
      p_gst_number,
      p_admin_name,
      p_admin_email,
      p_admin_phone,
      p_address_line1,
      p_city,
      p_state,
      p_country,
      p_postal_code,
      p_id_document,
      p_tax_document
    ]
          };


    // const values = [
    //   p_org_id,
    //   p_name,
    //   p_type,
    //   p_industry,
    //   p_registration_number,
    //   p_admin_name,
    //   p_admin_email,
    //   p_admin_phone,
    //   p_address_line1,
    //   p_city,
    //   p_state,
    //   p_country,
    //   p_postal_code,
    //   p_office_mail,
    //   p_office_phone,
    //   p_id_document,
    //   p_tax_document
    // ];

    const result = await this.utility.sql.query(query);

    console.log(result)

    if (!result.rows || result.rows.length === 0) {
      return this.utility.response.init(res, false, "No response from database", {}, 500);
    }

    return this.utility.response.init(
      res,
      true,
      "Facility created successfully ✅",
      { facility: result.rows[0] }
    );

  } catch (err) {
    console.error("createFacility error:", err);
    return this.utility.response.init(res, false, "Internal server error");
  }
};



}

module.exports = Facilities;