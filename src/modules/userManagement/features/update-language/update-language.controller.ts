import { Request, Response } from 'express';
import { UpdateLanguageCommand } from './update-language.command';

export class UpdateLanguageController {
  async updateLanguage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { languageCode } = req.body as UpdateLanguageCommand;
      
      // TODO: Implement actual user language update in your user service
      // const userService = new UserService();
      // await userService.updateLanguage(userId, languageCode);
      
      res.status(200).json({ 
        message: 'Language preference updated successfully',
        languageCode 
      });
    } catch (error) {
      console.error('Error updating language preference:', error);
      res.status(500).json({ message: 'Failed to update language preference' });
    }
  }
} 