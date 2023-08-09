<template>
  <v-main>
    <Head>
      <Title>Contact Us - Ai Apps Universe</Title>
    </Head>
    <v-container fluid class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="name"
                      :rules="nameRules"
                      label="Name"
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="E-mail"
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="subject"
                      :rules="subjectRules"
                      label="Subject"
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="message"
                      :rules="messageRules"
                      label="Message"
                      required
                      variant="outlined"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-row class="d-flex justify-start">
                  <v-btn color="error" @click="reset" class="ml-5">
                    Reset
                  </v-btn>
                  <v-btn
                    :disabled="!valid"
                    color="success"
                    @click="submit"
                    class="ml-3 mb-3"
                  >
                    Send
                  </v-btn>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
  
  <script>
export default {
  data: () => ({
    valid: true,
    name: "",
    email: "",
    subject: "",
    message: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    subjectRules: [(v) => !!v || "Subject is required"],
    messageRules: [(v) => !!v || "Message is required"],
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Perform some action here
        alert("Submitted Successfully");
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
  