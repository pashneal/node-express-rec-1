// This is (some of) the code for the WebSession concept which was introduced in lecture on 9/18.
// We're storing the user (in the form of the username string for now) when the user logs in, and we 
// reset the session's user when the user logs out.

import { SessionData } from "express-session";
import { UnauthenticatedError } from "./errors";

export type WebSessionDoc = SessionData;

// Here, we're overloading the Express session data type so it has the data we need for our app. Right now,
// that's just the user.
declare module "express-session" {
  export interface SessionData {
    // This will not be our final implementation! Starting next week, we will have a User concept with a
    // more rigorous implementation than a string representing the username.
    user?: string;
  }
}

export default class WebSessionConcept {


  // Concept actions
  start(session: WebSessionDoc, username: string) {
    // In Express, the session is created spontaneously when the connection is first made, so we do not need
    // to explicitly allocate a session; we only need to keep track of the user.

    this.hasToBe.inactive(session);
    session.user = username;
  }

  getUser(session: WebSessionDoc) {
    this.hasToBe.active(session);
    return session.user!;
  }

  end(session: WebSessionDoc) {
    // We make sure the user is logged in before allowing the end action.
    this.hasToBe.active(session);
    session.user = undefined;
  }

  // Note: It doesn't make sense to have asserts be 
  // in the same scope as Concept actions, as they do not
  // mutate nor return anything, and they are not "actions"
  // a la what was introduced in lecture.
  //
  // They are more like "preconditions" 
  // We move them to a inner scope 
  // 
  // I may write a blog post on this idea of concept design
  // in software, perhaps it could be an improvement
  // to the concept framework as a whole
  //
  // Written to mirror natural language as concepts often do

  // Preconditions
  hasToBe = {
    active(session: WebSessionDoc) {
      if (session.user === undefined) {
        throw new UnauthenticatedError("Not logged in!");
      }
    },

    inactive(session: WebSessionDoc) {
      if (session.user !== undefined) {
        throw new UnauthenticatedError(`Not logged out! Currently logged in as ${session.user}`);
      }
    }
  }

}
